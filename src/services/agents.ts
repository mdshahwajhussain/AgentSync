import { supabase } from './supabase';

export interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentData {
  name: string;
  email: string;
  mobile: string;
}

export const agentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Agent[];
  },

  async create(agentData: CreateAgentData) {
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        ...agentData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async update(id: string, agentData: Partial<CreateAgentData>) {
    const { data, error } = await supabase
      .from('agents')
      .update(agentData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};