import { useState, useEffect } from "react";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { getClassList, getSubjects, getTopics, getSubtopics, insertQuestion, updateQuestion } from "../apis/questionApi";
import Editor from "../components/editor";
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../components/loader"
import ServerMessage from "../components/serverMessage";
import SERVERCODETYPE from "../utils/constants"

const QuestionSetup = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({type:"",message:""});
  const location = useLocation();
  const questionToEdit = location.state?.question;
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    class: location.state?.selectedValues?.class || questionToEdit?.classId || "",
    subject: location.state?.selectedValues?.subject || questionToEdit?.subjectId || "",
    topic: location.state?.selectedValues?.topic || questionToEdit?.topicId || "",
    subtopic: location.state?.selectedValues?.subtopic || questionToEdit?.subtopicId || "",
    difficulty: questionToEdit?.difficulty || "",
    questionType: questionToEdit?.questionType || "",
    questionText: questionToEdit?.questionText || "",
    options: questionToEdit?.options || { a: "", b: "", c: "", d: "" },
    questionImage: questionToEdit?.questionImage || null,
    correctAnswerOption: questionToEdit?.correctAnswerOption || "",
    correctAnswerText: questionToEdit?.correctAnswerText || "",
    answerExplanation: questionToEdit?.answerExplanation || "",
  });

  const [editorHtml, setEditorHtml] = useState("");


  useEffect(() => {
    getClassList().then(setClasses);
  }, []);

  useEffect(() => {
    if (formData.class) getSubjects(formData.class).then(setSubjects);
  }, [formData.class]);

  useEffect(() => {
    if (formData.subject) getTopics(formData.subject).then(setTopics);
  }, [formData.subject]);

  useEffect(() => {
    if (formData.topic) getSubtopics(formData.topic).then(setSubtopics);
  }, [formData.topic]);

  const handleChange = (e) => {
    // if(e.target.name==="")
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, questionImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    // Transform form data before submission
    const submissionData = {
      ...formData,
      classId: formData.class,
      subjectId: formData.subject,
      topicId: formData.topic,
      subtopicId: formData.subtopic,
    };

    // Remove old keys
    delete submissionData.class;
    delete submissionData.subject;
    delete submissionData.topic;
    delete submissionData.subtopic;


    try {
    setLoading(true);
      if (questionToEdit?._id) {
        await updateQuestion(submissionData, questionToEdit?._id);
        setLoading(false);
        navigate('/questions');
         
      } else {
        const response = await insertQuestion(submissionData);
        if(response?.message==="Question inserted successfully"){
          setServerMessage({type:SERVERCODETYPE.SUCCESS, message:response?.message})
        }else{
          setServerMessage({type:SERVERCODETYPE.ERROR, message:response?.message})
        }
        setLoading(false)
      }
      // Reset form after submission
      setFormData((prevData) => ({
        ...prevData,
        class: "",
        subject: "",
        topic: "",
        subtopic: "",
        difficulty: "",
        questionType: "",
        questionText: "",
        options: { a: "", b: "", c: "", d: "" },
        questionImage: null,
        correctAnswerOption: "",
        correctAnswerText: "",
        answerExplanation: "", // Reset answerExplanation properly
      }));
    } catch (error) {
      console.error("Error submitting question:", error);
      setServerMessage({type:SERVERCODETYPE.ERROR, message:error?.message})
      setLoading(false);
    }
  };


  return (
    <div className="p-24">
      <Card className="p-16 shadow-lg rounded-xl bg-gradient-to-r from-blue-100 to-blue-150 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold mb-4">Question Setup</h1>
          {questionToEdit?._id&&<IconButton onClick={() => navigate(-1)} className="mr-2 ">
            <ArrowBackIcon /> <span>Back</span>
          </IconButton>}
        </div>
        {loading &&<Loader loading={loading} />}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {["class", "subject", "topic"].map(
            (field, index) => (
              <FormControl variant="standard" key={index} fullWidth>
                <InputLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
                <Select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                >
                  {eval(field == "class" ? field + "es" : field + "s").map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          )}

        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="mb-4">
            <FormControl variant="standard" fullWidth>
              <InputLabel>Subtopics</InputLabel>
              <Select
                name={"subtopic"}
                value={formData["subtopic"]}
                onChange={handleChange}
              >
                {subtopics.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="mb-4">
            <FormControl variant="standard" fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mb-4">
            <FormControl variant="standard" fullWidth>
              <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
              <Select
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
              >
                <MenuItem value="mcq">MCQ</MenuItem>
                <MenuItem value="short">Short Answer</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="mb-4">
          <Editor
            value={formData.questionText}
            onChange={(html) =>
              setFormData((prevData) => ({
                ...prevData,
                questionText: html === "<p><br></p>" ? "" : html,
              }))
            }  
            placeholder="Enter Question (Supports LaTeX)"
            label={"Question"}
          />
        </div>
        {formData?.questionType === "mcq" && (
          <Grid container spacing={3}>
            {["a", "b", "c", "d"].map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Editor
                  key={key}
                  label={`Option ${key.toUpperCase()}`}
                  value={formData.options[key]}
                  onChange={(html) => {
                    setFormData((prev) => ({
                      ...prev,
                      options: { ...prev.options, [key]: html === "<p><br></p>" ? "" : html },
                    }));
                  }}
                  placeholder="Enter Option (Supports LaTeX)"
                />
              </Grid>
            ))}
          </Grid>
        )}


        {formData?.questionType === "mcq" && (
          <div className="mb-4 mt-8">
            <FormControl variant="standard" fullWidth>
              <InputLabel>Correct Answer Option</InputLabel>
              <Select
                name="correctAnswerOption"
                value={formData["correctAnswerOption"]}
                onChange={handleChange}
              >
                <MenuItem value="a">A</MenuItem>
                <MenuItem value="b">B</MenuItem>
                <MenuItem value="c">C</MenuItem>
                <MenuItem value="d">D</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
        {formData?.questionType !== "mcq" && <div className="mb-4">
          <Editor
            value={formData.correctAnswerText}
            onChange={(html) => setFormData({ ...formData, correctAnswerText: html === "<p><br></p>" ? "" : html })}
            placeholder="Enter Correct Answer"
            label={"Correct Answer"}
          />
        </div>}

        <div className="mb-4">
          <Editor
            value={formData.answerExplanation}
            onChange={(html) =>
              setFormData((prevData) => ({
                ...prevData,
                answerExplanation: html === "<p><br></p>" ? "" : html,
              }))
            }              placeholder="Enter Correct Answer"
            label={"Answer Explanation"}
          />
        </div>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Card>
      <ServerMessage type={serverMessage?.type} message={serverMessage?.message} open={serverMessage?.message} onClose={()=>setServerMessage({})}></ServerMessage>
    </div>
  );
};

export default QuestionSetup;
