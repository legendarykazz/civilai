import { supabase } from './supabase';

class SupabaseService {

    // --- Blog API ---
    async getBlogs(onlyApproved = false, limit = null) {
        let query = supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (onlyApproved) {
            query = query.eq('status', 'approved');
        }

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data.map(this._mapBlog);
    }

    async getBlogById(id) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return this._mapBlog(data);
    }

    async createBlog(post) {
        const { data, error } = await supabase
            .from('blogs')
            .insert([{
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image_url: post.image,
                tags: post.tags,
                author_name: post.author,
                likes: 0,
                status: 'pending' // Default to pending
            }])
            .select()
            .single();

        if (error) throw error;
        return this._mapBlog(data);
    }

    async updateBlogStatus(id, status) {
        const { data, error } = await supabase
            .from('blogs')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this._mapBlog(data);
    }

    // --- Admin CMS API ---
    async getSiteContent() {
        const { data, error } = await supabase
            .from('site_content')
            .select('*');

        if (error) {
            console.error('CMS Error:', error);
            return {};
        }

        // Convert array to object key:value
        return data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }

    async updateSiteContent(key, value, section = 'home') {
        const { data, error } = await supabase
            .from('site_content')
            .upsert({ key, value, section })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // --- Forum API ---
    async getQuestions(limit = null) {
        let query = supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        return data.map(this._mapQuestion);
    }

    async getQuestionById(id) {
        const { data, error } = await supabase
            .from('questions')
            .select(`
                *,
                answers (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return this._mapQuestion(data);
    }

    async createQuestion(question) {
        const { data, error } = await supabase
            .from('questions')
            .insert([{
                title: question.title,
                content: question.content,
                tags: question.tags,
                author_name: question.author,
                views: 0,
                votes: 0
            }])
            .select()
            .single();

        if (error) throw error;
        return this._mapQuestion(data);
    }

    async addAnswer(questionId, answer) {
        const { data, error } = await supabase
            .from('answers')
            .insert([{
                question_id: questionId,
                content: answer.content,
                author_name: answer.author,
                votes: 0
            }])
            .select()
            .single();

        if (error) throw error;
        return this._mapAnswer(data);
    }

    async voteQuestion(questionId, userId, direction = 'up') {
        const { data, error } = await supabase.rpc('increment_vote', { row_id: questionId });

        if (error) {
            // Fallback optimistic update
            const { data: q } = await supabase.from('questions').select('votes').eq('id', questionId).single();
            if (q) {
                await supabase.from('questions').update({ votes: q.votes + 1 }).eq('id', questionId);
            }
        }
    }

    // --- Mappers ---
    _mapBlog(dbPost) {
        if (!dbPost) return null;
        return {
            id: dbPost.id,
            title: dbPost.title,
            excerpt: dbPost.excerpt,
            content: dbPost.content,
            image: dbPost.image_url,
            tags: dbPost.tags || [],
            author: dbPost.author_name || 'Unknown',
            date: new Date(dbPost.created_at).toLocaleDateString(),
            likes: dbPost.likes,
            status: dbPost.status
        };
    }

    _mapQuestion(dbQ) {
        if (!dbQ) return null;
        return {
            id: dbQ.id,
            title: dbQ.title,
            content: dbQ.content,
            tags: dbQ.tags || [],
            author: dbQ.author_name || 'Anonymous',
            views: dbQ.views,
            votes: dbQ.votes,
            date: dbQ.created_at,
            answers: (dbQ.answers || []).map(a => ({
                id: a.id,
                content: a.content,
                author: a.author_name,
                votes: a.votes,
                date: a.created_at
            }))
        };
    }

    _mapAnswer(dbA) {
        return {
            id: dbA.id,
            content: dbA.content,
            author: dbA.author_name,
            votes: dbA.votes,
            date: dbA.created_at
        };
    }
}

export const api = new SupabaseService();
