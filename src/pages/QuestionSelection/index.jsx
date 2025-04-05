import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails, MenuItem, Select, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { fetchTopics, fetchSubtopics, fetchQuestions } from "../../apis/questionApi";

const QuestionSelection = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    const loadTopics = async () => {
      const data = await fetchTopics();
      setTopics(data);
    };
    loadTopics();
  }, []);

  // Fetch subtopics when topic changes
  useEffect(() => {
    if (selectedTopic) {
      const loadSubtopics = async () => {
        const data = await fetchSubtopics(selectedTopic);
        setSubtopics(data);
      };
      loadSubtopics();
      setQuestions([]); // Clear questions when topic changes
    }
  }, [selectedTopic]);

  // Fetch questions when topic or subtopic changes
  useEffect(() => {
    if (selectedTopic) {
      const loadQuestions = async () => {
        const data = await fetchQuestions(selectedTopic, selectedSubtopic);
        setQuestions(data);
      };
      loadQuestions();
    }
  }, [selectedTopic, selectedSubtopic]);

  // Handle edit question
  const handleEdit = (question) => {
    navigate("/question-setup", { state: { questionData: question } });
  };

  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>
        Question Selection
      </Typography>

      {/* Topic Dropdown */}
      <Select fullWidth value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} displayEmpty>
        <MenuItem value="" disabled>Select Topic</MenuItem>
        {topics.map((topic) => (
          <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
        ))}
      </Select>

      {/* Subtopic Dropdown */}
      <Select fullWidth className="mt-4" value={selectedSubtopic} onChange={(e) => setSelectedSubtopic(e.target.value)} displayEmpty>
        <MenuItem value="">All Subtopics</MenuItem>
        {subtopics.map((subtopic) => (
          <MenuItem key={subtopic.id} value={subtopic.id}>{subtopic.name}</MenuItem>
        ))}
      </Select>

      {/* Questions List */}
      <div className="mt-4">
        {questions.length === 0 ? (
          <Typography>No questions available</Typography>
        ) : (
          questions.map((question) => (
            <Accordion key={question.id} className="mb-2">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{question.questionText}</Typography>
                <IconButton onClick={() => handleEdit(question)} className="ml-auto">
                  <EditIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Difficulty: {question.difficulty}</Typography>
                <Typography>Type: {question.questionType}</Typography>
                <Typography>Correct Answer: {question.correctAnswerOption}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionSelection;
