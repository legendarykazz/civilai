// Initial Sample Data to populate if empty
const SAMPLE_BLOGS = [
    {
        id: '1',
        title: "The Future of Structural Health Monitoring",
        excerpt: "How AI and IoT sensors are revolutionizing how we maintain aging infrastructure.",
        content: "Detailed content about structural health monitoring...",
        date: "Jan 24, 2026",
        author: "Dr. A. Smith",
        tags: ["AI", "Structures"],
        image: "https://images.unsplash.com/photo-1581093588402-4857474d2f78?auto=format&fit=crop&q=80&w=800",
        likes: 120
    },
    {
        id: '2',
        title: "Optimizing Concrete Mixes with Machine Learning",
        excerpt: "Reducing carbon footprint while maintaining strength using predictive models.",
        content: "Content about concrete optimization...",
        date: "Jan 20, 2026",
        author: "Engr. J. Doe",
        tags: ["Materials", "Sustainability"],
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
        likes: 85
    }
];

const SAMPLE_QUESTIONS = [
    {
        id: '1',
        title: "What is the best way to model pile foundation elasticity in ProtaStructure?",
        content: "I'm struggling with the soil interaction parameters...",
        author: "CivilEng_99",
        answers: [],
        views: 340,
        tags: ["ProtaStructure", "Geotech"],
        votes: 45,
        date: new Date().toISOString()
    }
];

class MockService {
    constructor() {
        this.STORAGE_KEYS = {
            BLOGS: 'civil_ai_blogs',
            QUESTIONS: 'civil_ai_questions',
            VOTES: 'civil_ai_votes' // Track user votes to prevent duplicates
        };
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.STORAGE_KEYS.BLOGS)) {
            localStorage.setItem(this.STORAGE_KEYS.BLOGS, JSON.stringify(SAMPLE_BLOGS));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.QUESTIONS)) {
            localStorage.setItem(this.STORAGE_KEYS.QUESTIONS, JSON.stringify(SAMPLE_QUESTIONS));
        }
    }

    // --- Helpers ---
    _get(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    _set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    async _delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Blog API ---
    async getBlogs() {
        await this._delay();
        return this._get(this.STORAGE_KEYS.BLOGS);
    }

    async getBlogById(id) {
        await this._delay();
        const blogs = this._get(this.STORAGE_KEYS.BLOGS);
        return blogs.find(b => b.id === id);
    }

    async createBlog(post) {
        await this._delay();
        const blogs = this._get(this.STORAGE_KEYS.BLOGS);
        const newPost = {
            ...post,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            likes: 0
        };
        this._set(this.STORAGE_KEYS.BLOGS, [newPost, ...blogs]);
        return newPost;
    }

    // --- Forum API ---
    async getQuestions() {
        await this._delay();
        return this._get(this.STORAGE_KEYS.QUESTIONS);
    }

    async getQuestionById(id) {
        await this._delay();
        const questions = this._get(this.STORAGE_KEYS.QUESTIONS);
        return questions.find(q => q.id === id);
    }

    async createQuestion(question) {
        await this._delay();
        const questions = this._get(this.STORAGE_KEYS.QUESTIONS);
        const newQuestion = {
            ...question,
            id: Date.now().toString(),
            answers: [],
            views: 0,
            votes: 0,
            date: new Date().toISOString()
        };
        this._set(this.STORAGE_KEYS.QUESTIONS, [newQuestion, ...questions]);
        return newQuestion;
    }

    async addAnswer(questionId, answer) {
        await this._delay();
        const questions = this._get(this.STORAGE_KEYS.QUESTIONS);
        const index = questions.findIndex(q => q.id === questionId);
        if (index === -1) throw new Error('Question not found');

        const newAnswer = {
            ...answer,
            id: Date.now().toString(),
            date: new Date().toISOString()
        };

        // Add answer to the question
        // Note: In a real DB this would be a separate table, but for NoSQL-ish local storage embedding is fine
        if (!questions[index].answers) questions[index].answers = [];
        questions[index].answers.push(newAnswer);

        this._set(this.STORAGE_KEYS.QUESTIONS, questions);
        return newAnswer;
    }

    async voteQuestion(questionId, userId, direction = 'up') {
        const questions = this._get(this.STORAGE_KEYS.QUESTIONS);
        const index = questions.findIndex(q => q.id === questionId);
        if (index === -1) return;

        // Simple vote logic (increment/decrement)
        // In a real app we'd track user votes to prevent double voting
        questions[index].votes += (direction === 'up' ? 1 : -1);
        this._set(this.STORAGE_KEYS.QUESTIONS, questions);
        return questions[index];
    }
}

export const api = new MockService();
