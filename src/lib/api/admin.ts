import { apiClient } from './client';
import { UserInstance, AdminDashboardStats } from '@/types';

export async function fetchAdminStats(token: string): Promise<AdminDashboardStats> {
  apiClient.setToken(token);
  
  try {
    // Fetch stats from the API
    const stats = await apiClient.getGlobalStats();
    
    // Map the API response to our AdminDashboardStats interface
    return {
      totalInstances: stats.total_instances || 0,
      activeInstances: stats.active_instances || 0,
      messagesLastHour: stats.messages_last_hour || 0,
      messagesLastDay: stats.messages_last_day || 0,
      systemHealth: stats.system_health || 'healthy',
      recentActivity: stats.recent_activity || []
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    // Return default values if the API call fails
    return {
      totalInstances: 0,
      activeInstances: 0,
      messagesLastHour: 0,
      messagesLastDay: 0,
      systemHealth: 'healthy',
      recentActivity: []
    };
  }
}

export async function fetchInstances(token: string): Promise<UserInstance[]> {
  apiClient.setToken(token);
  
  try {
    return await apiClient.getUsers();
  } catch (error) {
    console.error('Failed to fetch instances:', error);
    return [];
  }
}

export async function fetchInstanceDetails(token: string, instanceId: string): Promise<UserInstance | null> {
  apiClient.setToken(token);
  
  try {
    return await apiClient.getUser(instanceId);
  } catch (error) {
    console.error('Failed to fetch instance details:', error);
    return null;
  }
}

export async function deleteInstance(token: string, instanceId: string): Promise<boolean> {
  apiClient.setToken(token);
  
  try {
    await apiClient.deleteUser(instanceId);
    return true;
  } catch (error) {
    console.error('Failed to delete instance:', error);
    return false;
  }
}

export async function createInstance(token: string, instance: Partial<UserInstance>): Promise<UserInstance | null> {
  apiClient.setToken(token);
  
  try {
    return await apiClient.createUser(instance);
  } catch (error) {
    console.error('Failed to create instance:', error);
    return null;
  }
}