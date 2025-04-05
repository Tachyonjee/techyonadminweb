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
import { getSubjects, getTopics, getSubtopics, getQuestionsByTopic, getQuestionsBySubtopic, getQuestionsBySubject, updateQuestion } from "../../apis/questionApi";
import { MathJaxContext } from "better-react-mathjax";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Loader from "../../components/loader"

const QuestionList = () => {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedSubtopic, setSelectedSubtopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchSubjects();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedSubject) {
            fetchTopics();
        }
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedTopic) {
            fetchSubtopics();
        }
    }, [selectedTopic]);

    useEffect(() => {
        if (selectedSubtopic) {
            fetchQuestions();
        }
    }, [selectedSubtopic]);

    const fetchClasses = async () => {
        const classList = await getClassList();
        setClasses(classList);
    };

    const fetchSubjects = async () => {
        const subjectList = await getSubjects(selectedClass);
        setSubjects(subjectList);
    };

    const fetchTopics = async () => {
        const topicList = await getTopics(selectedSubject);
        setTopics(topicList);
    };

    const fetchSubtopics = async () => {
        const subtopicList = await getSubtopics(selectedTopic);
        setSubtopics(subtopicList);
    };

    const fetchQuestions = async () => {
        if (!selectedSubtopic && !selectedTopic && !selectedSubject) {
            setQuestions([]);
            return;
        }

        setLoading(true);
        try {
            let questionsData = [];
            
            if (selectedSubtopic) {
                if (!user?.role || !user?.id) {
                    throw new Error('User role and ID are required');
                }
                questionsData = await getQuestionsBySubtopic(selectedSubtopic, user.role, user.id);
            } else if (selectedTopic) {
                if (!user?.role || !user?.id) {
                    throw new Error('User role and ID are required');
                }
                questionsData = await getQuestionsByTopic(selectedTopic, user.role, user.id);
            } else if (selectedSubject) {
                if (!user?.role || !user?.id) {
                    throw new Error('User role and ID are required');
                }
                questionsData = await getQuestionsBySubject(selectedSubject, user.role, user.id);
            }

            // Filter questions based on user's access
            const accessibleQuestions = questionsData.filter(question => canAccessQuestion(question));
            setQuestions(accessibleQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            showError(error.message || 'Failed to fetch questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

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
                    {/* Class */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                {classes.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Subject */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="standard" disabled={!selectedClass}>
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
