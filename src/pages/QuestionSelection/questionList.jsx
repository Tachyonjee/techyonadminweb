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
import { useSelector } from "react-redux";
import { 
    getSubjects, 
    getTopics, 
    getSubtopics, 
    getQuestionsByTopic, 
    getQuestionsBySubtopic, 
    getQuestionsBySubject, 
    updateQuestion,
    getClassList 
} from "../../apis/questionApi";
import { MathJaxContext } from "better-react-mathjax";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Loader from "../../components/loader"

const QuestionList = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

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
        if (user?.role === 'teacher') {
            // For teachers, set their assigned class and subject
            if (user.class) {
                setSelectedClass(user.class);
                fetchSubjects(user.class);
            }
            if (user.subject) {
                setSelectedSubject(user.subject);
            }
        } else {
            // For other roles, fetch all classes
            fetchClasses();
        }
    }, [user]);

    useEffect(() => {
        if (selectedClass && user?.role !== 'teacher') {
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

    const fetchSubjects = async (classId = selectedClass) => {
        const subjectList = await getSubjects(classId);
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
                const response = await getQuestionsBySubtopic(selectedSubtopic);
                console.log('Questions by subtopic response:', response);
                questionsData = response?.data || [];
            } else if (selectedTopic) {
                const response = await getQuestionsByTopic(selectedTopic);
                console.log('Questions by topic response:', response);
                questionsData = response?.data || [];
            } else if (selectedSubject) {
                const response = await getQuestionsBySubject(selectedSubject);
                console.log('Questions by subject response:', response);
                questionsData = response?.data || [];
            }

            console.log('Final questions data:', questionsData);
            setQuestions(Array.isArray(questionsData) ? questionsData : []);
        } catch (error) {
            console.error('Error fetching questions:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch questions';
            showError(errorMessage);
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
                                disabled={user?.role === 'teacher'}
                            >
                                {user?.role === 'teacher' ? (
                                    <MenuItem value={user.class}>
                                        {classes.find(c => c._id === user.class)?.name || 'Loading...'}
                                    </MenuItem>
                                ) : (
                                    classes.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                )}
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
                                disabled={user?.role === 'teacher'}
                            >
                                {user?.role === 'teacher' ? (
                                    <MenuItem value={user.subject}>
                                        {subjects.find(s => s._id === user.subject)?.name || 'Loading...'}
                                    </MenuItem>
                                ) : (
                                    subjects.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                )}
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
                {!loading && (!Array.isArray(questions) || questions.length === 0) ? (
                    <Typography>No questions found.</Typography>
                ) : (
                    <MathJaxContext>
                        {Array.isArray(questions) && questions.map((q, index) => (
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
                        ))}
                    </MathJaxContext>
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
