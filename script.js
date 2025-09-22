document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split("/").pop();

    // Data for subjects, chapters, and MCQs
    const data = {
        'English': {
            chapters: ['Chapter 1: The Last Sermon', 'Chapter 2: The Wise Caliph', 'Chapter 3: The Daffodils'],
            mcqs: {
                'Chapter 1: The Last Sermon': [
                    { question: 'When was the last sermon delivered?', answers: [{ text: '10th Zil-Hajj', correct: true }, { text: '1st Muharram', correct: false }, { text: '27th Ramadan', correct: false }, { text: '12th Rabi-ul-Awwal', correct: false }] },
                    { question: 'Where was it delivered?', answers: [{ text: 'Mount Arafat', correct: true }, { text: 'Mecca', correct: false }, { text: 'Medina', correct: false }, { text: 'Taif', correct: false }] }
                ],
                'Chapter 2: The Wise Caliph': [
                    { question: 'Who is known as the Wise Caliph?', answers: [{ text: 'Hazrat Umar (RA)', correct: true }, { text: 'Hazrat Ali (RA)', correct: false }, { text: 'Hazrat Abu Bakr (RA)', correct: false }, { text: 'Hazrat Usman (RA)', correct: false }] }
                ]
            }
        },
        'Maths': {
            chapters: ['Chapter 1: Algebra', 'Chapter 2: Geometry', 'Chapter 3: Trigonometry'],
            mcqs: { /* Add Maths MCQs here */ }
        },
        'Biology': {
            chapters: ['Chapter 1: Cell Biology', 'Chapter 2: Genetics', 'Chapter 3: Ecology'],
            mcqs: { /* Add Biology MCQs here */ }
        },
        'Chemistry': {
            chapters: [
                'Chapter 1: Chemical Reactions', 
                'Chapter 2: The Periodic Table',
                // This object creates a direct link to your custom HTML file
                { title: 'Chapter 4: Structure of Molecules (Quiz)', url: 'Chapter No 4.html' } 
            ],
            mcqs: { /* Add other Chemistry MCQs here if needed */ }
        },
        'Physics': {
            chapters: ['Chapter 1: Motion', 'Chapter 2: Forces', 'Chapter 3: Energy'],
            mcqs: { /* Add Physics MCQs here */ }
        },
        'Urdu': {
            chapters: ['حمد', 'نعت', 'مضامین'],
            mcqs: { /* Add Urdu MCQs here */ }
        },
        'Islamyat': {
            chapters: ['Chapter 1: Faith', 'Chapter 2: Pillars of Islam'],
            mcqs: { /* Add Islamyat MCQs here */ }
        },
        'Mutal-e-Quran': {
            chapters: ['Surah Al-Baqarah', 'Surah Al-Ikhlas'],
            mcqs: { /* Add Mutal-e-Quran MCQs here */ }
        },
        'Pak Study': {
            chapters: ['Chapter 1: Ideology of Pakistan', 'Chapter 2: Early History'],
            mcqs: { /* Add Pak Study MCQs here */ }
        }
    };

    // Router logic based on current page
    if (page === 'index.html' || page === '') {
        renderHomePage();
    } else if (page === 'chapters.html') {
        renderChaptersPage();
    } else if (page === 'mcqs.html') {
        renderMCQsPage();
    }

    // --- RENDER FUNCTIONS ---

    function renderHomePage() {
        const subjectGrid = document.getElementById('subject-grid');
        if (!subjectGrid) return;
        subjectGrid.innerHTML = '';
        Object.keys(data).forEach((subject, index) => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `<h2>${subject}</h2>`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.addEventListener('click', () => {
                localStorage.setItem('selectedSubject', subject);
                window.location.href = 'chapters.html';
            });
            subjectGrid.appendChild(card);
        });
    }

    // This updated function handles both regular chapters and special links
    function renderChaptersPage() {
        const subject = localStorage.getItem('selectedSubject');
        if (!subject) {
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('subject-title').textContent = `${subject} Chapters`;
        const chapterList = document.getElementById('chapter-list');
        chapterList.innerHTML = '';
        const chapters = data[subject].chapters;

        chapters.forEach((chapter, index) => {
            const link = document.createElement('a');
            link.className = 'chapter-link';
            link.style.animationDelay = `${index * 0.1}s`;

            // Check if the chapter is an object (our special link) or a string
            if (typeof chapter === 'object' && chapter.url) {
                // This is our custom HTML file link
                link.href = chapter.url;
                link.textContent = chapter.title;
            } else {
                // This is a regular chapter that links to MCQs
                link.href = '#';
                link.textContent = chapter;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.setItem('selectedChapter', chapter);
                    window.location.href = 'mcqs.html';
                });
            }
            
            chapterList.appendChild(link);
        });
    }

    function renderMCQsPage() {
        const subject = localStorage.getItem('selectedSubject');
        const chapter = localStorage.getItem('selectedChapter');

        if (!subject || !chapter) {
            window.location.href = 'index.html';
            return;
        }

        // Set back link
        document.getElementById('back-to-chapters').href = 'chapters.html';
        document.getElementById('mcq-header').textContent = `${chapter}`;

        const questions = data[subject].mcqs[chapter] || [];
        const questionContainer = document.getElementById('question-container');
        const questionElement = document.getElementById('question');
        const answerButtonsElement = document.getElementById('answer-buttons');
        const resultContainer = document.getElementById('result-container');
        const scoreElement = document.getElementById('score');
        const totalQuestionsElement = document.getElementById('total-questions');
        const restartBtn = document.getElementById('restart-btn');
        
        let currentQuestionIndex = 0;
        let score = 0;

        if (questions.length === 0) {
            questionContainer.innerHTML = "<p>No MCQs available for this chapter yet.</p>";
            return;
        }

        startGame();

        function startGame() {
            currentQuestionIndex = 0;
            score = 0;
            resultContainer.classList.add('hide');
            questionContainer.classList.remove('hide');
            setNextQuestion();
        }

        function setNextQuestion() {
            resetState();
            showQuestion(questions[currentQuestionIndex]);
        }

        function showQuestion(question) {
            questionElement.innerText = question.question;
            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.classList.add('btn');
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                button.addEventListener('click', selectAnswer);
                answerButtonsElement.appendChild(button);
            });
        }

        function resetState() {
            while (answerButtonsElement.firstChild) {
                answerButtonsElement.removeChild(answerButtonsElement.firstChild);
            }
        }

        function selectAnswer(e) {
            const selectedButton = e.target;
            const correct = selectedButton.dataset.correct === 'true';

            if (correct) {
                score++;
            }

            Array.from(answerButtonsElement.children).forEach(button => {
                setStatusClass(button, button.dataset.correct === 'true');
                button.disabled = true; // Disable buttons after selection
            });

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    setNextQuestion();
                } else {
                    showResult();
                }
            }, 1500); // Wait 1.5 seconds before next question
        }

        function setStatusClass(element, correct) {
            if (correct) {
                element.classList.add('correct');
            } else {
                element.classList.add('wrong');
            }
        }

        function showResult() {
            questionContainer.classList.add('hide');
            resultContainer.classList.remove('hide');
            scoreElement.textContent = score;
            totalQuestionsElement.textContent = questions.length;
        }

        restartBtn.addEventListener('click', startGame);
    }
});