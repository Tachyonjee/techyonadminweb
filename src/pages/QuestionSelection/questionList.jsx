import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Snackbar,
    Alert,
    Card
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { getSubjects, getTopics, getSubtopics, getQuestionsByTopic, getQuestionsBySubtopic, getQuestionsBySubject } from "../../apis/questionApi";
import { MathJaxContext } from "better-react-mathjax";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Loader from "../../components/loader"

const QuestionList = () => {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedSubtopic, setSelectedSubtopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Fetch subjects on component mount
    useEffect(() => {
        setLoading(true);
        getSubjects()
            .then(setSubjects)
            .catch(() => showError("Failed to fetch subjects"))
            .finally(() => setLoading(false));
    }, []);

    // Fetch topics when subject is selected
    useEffect(() => {
        if (selectedSubject) {
            getTopics(selectedSubject)
                .then(setTopics)
                .catch(() => showError("Failed to fetch topics"))
                .finally(() => setLoading(false));

            setSelectedTopic("");
            setSubtopics([]);
            setSelectedSubtopic("");
            setQuestions([]);
        }
    }, [selectedSubject]);
    
    useEffect(() => {
        if (selectedTopic) {
            getSubtopics(selectedTopic)
                .then(setSubtopics)
                .catch(() => showError("Failed to fetch subtopics"))
                .finally(() => setLoading(false));

            setSelectedSubtopic("");
            setQuestions([]);
        }
    }, [selectedTopic]);

    // Fetch questions based on topic, subtopic, or subject
    useEffect(() => {
        if (selectedSubtopic) {
            setLoading(true);
            getQuestionsBySubtopic(selectedSubtopic)
                .then(setQuestions)
                .catch(() => showError("Failed to fetch questions"))
                .finally(() => setLoading(false));
        } else if (selectedTopic) {
            setLoading(true);
            getQuestionsByTopic(selectedTopic)
                .then(setQuestions)
                .catch(() => showError("Failed to fetch questions"))
                .finally(() => setLoading(false));
        } else if (selectedSubject) {
            setLoading(true);
            getQuestionsBySubject(selectedSubject)
                .then((data)=>{
                    console.log("data", data)
                    if(data){
                        setQuestions(data);
                        setLoading(false)
                    }
                })
                .catch(() => showError("Failed to fetch questions"))
                .finally(() => setLoading(false));
        }
    }, [selectedTopic, selectedSubtopic, selectedSubject]);


    const handleEdit = (question) => {
        navigate('/admin/question-setup', { state: { question } });
    };

    const showError = (msg) => {
        setSnackbar({ open: true, message: msg, severity: "error" });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <div className="p-24">
            <Card className="p-16 shadow-lg rounded-xl bg-gradient-to-r from-blue-100 to-blue-150 min-h-screen">
                <Typography variant="h4" gutterBottom>
                    View & Edit Questions
                </Typography>
                <Grid container spacing={3} className="mb-6">
                    {/* Subject */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Subject</InputLabel>
                            <Select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                {subjects.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Topic */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="standard" disabled={!selectedSubject}>
                            <InputLabel>Topic</InputLabel>
                            <Select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                {topics.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Subtopic */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="standard" disabled={!selectedTopic}>
                            <InputLabel>Subtopic</InputLabel>
                            <Select
                                value={selectedSubtopic}
                                onChange={(e) => setSelectedSubtopic(e.target.value)}
                            >
                                {subtopics.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {loading &&<Loader loading={loading} />}
                {questions.length === 0 && !loading? (
                    <Typography>No questions found.</Typography>
                ) : (
                    questions.map((q, index) => (
                        <Accordion key={q._id || index} className="mb-4">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className="flex justify-between items-center w-full bg-gradient-to-r from-blue-100 to-purple-300"
                            >
                                <div className="flex items-center w-full">
                                    <Typography variant="subtitle1" className="font-semibold flex flex-1">
                                        Q{index + 1}:{"     "}
                                        {q.questionText ? (
                                            <span className="ml-2"><Latex>{q.questionText || ""}</Latex></span>
                                        ) : (
                                            "No question text available"
                                        )}
                                    </Typography>
                                    <IconButton onClick={() => handleEdit(q)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </AccordionSummary>

                            <AccordionDetails className="space-y-3 bg-gradient-to-r from-blue-100 to-purple-200">
                                {q.questionType === "mcq" && q.options && Object.keys(q.options).length > 0 && (
                                    <div className="space-y-2 mb-2 m-10">
                                        <Typography><strong>Options:</strong></Typography>
                                        {Object.entries(q.options).map(([key, value]) => (
                                            <Typography key={key} className="flex flex-1 mt-1">
                                                {key.toUpperCase()} : {" "}
                                                {value ? (
                                                    <span className="ml-3"><Latex>{value || ""}</Latex></span>
                                                ) : (
                                                    "No option available"
                                                )}
                                            </Typography>
                                        ))}
                                        <Typography className="mt-2">
                                            <strong>Correct Option:</strong>{" "}
                                            {q.correctAnswerOption ? q.correctAnswerOption.toUpperCase() : "Not provided"}
                                        </Typography>
                                    </div>
                                )}
                                {q.correctAnswerText && (
                                    <Typography>
                                        <strong>Correct Answer:</strong>{" "}
                                        <Latex>{q.correctAnswerText || ""}</Latex>
                                    </Typography>
                                )}
                                {q.answerExplanation && (
                                    <Typography>
                                        <strong>Explanation:</strong>{" "}
                                      <Latex>{q.answerExplanation || ""}</Latex>
                                    </Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}

            </Card>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default QuestionList;
