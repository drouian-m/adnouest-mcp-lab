import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
  completed_at?: string;
}

let tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Préparer la présentation MCP',
    description: "Slides et démo pour l'atelier",
    status: 'in-progress',
    created_at: '2025-12-04T09:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Tester les resources',
    description: 'Vérifier que les URIs fonctionnent',
    status: 'todo',
    created_at: '2025-12-04T09:30:00Z',
  },
  {
    id: 'task-3',
    title: 'Documentation API',
    description: "Rédiger les exemples d'usage",
    status: 'done',
    created_at: '2025-12-03T14:00:00Z',
    completed_at: '2025-12-04T08:45:00Z',
  },
];

function generateId(): string {
  return 'task-' + Date.now().toString();
}

function createTask(mcpServer: McpServer) {
  mcpServer.registerTool(
    'create-task',
    {
      description: 'Créer une nouvelle tâche dans la todolist',
      inputSchema: {
        title: z.string().describe('Titre de la tâche'),
        description: z.string().optional().describe('Description optionnelle de la tâche'),
      },
      outputSchema: {
        id: z.string(),
        title: z.string(),
        status: z.string(),
      },
    },
    async ({ title, description }) => {
      const task: Task = {
        id: generateId(),
        title,
        description,
        status: 'todo',
        created_at: new Date().toISOString(),
      };

      tasks.push(task);

      const output = {
        id: task.id,
        title: task.title,
        status: task.status,
      };

      return {
        content: [
          {
            type: 'text',
            text: `✅ Tâche créée: "${title}" (ID: ${task.id})`,
          },
        ],
        structuredContent: output,
      };
    }
  );
}

function updateTask(mcpServer: McpServer) {
  mcpServer.registerTool(
    'update-task-status',
    {
      description: "Mettre à jour le statut d'une tâche",
      inputSchema: {
        task_id: z.string().describe('ID de la tâche à modifier'),
        status: z.enum(['todo', 'in-progress', 'done']).describe('Nouveau statut'),
      },
      outputSchema: {
        id: z.string(),
        title: z.string(),
        old_status: z.string(),
        new_status: z.string(),
      },
    },
    async ({ task_id, status }) => {
      const taskIndex = tasks.findIndex((t) => t.id === task_id);

      if (taskIndex === -1) {
        throw new Error(`Tâche avec l'ID "${task_id}" non trouvée`);
      }

      const task = tasks[taskIndex];
      const oldStatus = task.status;

      tasks[taskIndex].status = status;

      if (status === 'done' && oldStatus !== 'done') {
        tasks[taskIndex].completed_at = new Date().toISOString();
      }

      const output = {
        id: task_id,
        title: task.title,
        old_status: oldStatus,
        new_status: status,
      };

      return {
        content: [
          {
            type: 'text',
            text: `🔄 Tâche "${task.title}" changée de "${oldStatus}" vers "${status}"`,
          },
        ],
        structuredContent: output,
      };
    }
  );
}

function deleteTask(mcpServer: McpServer) {
  mcpServer.registerTool(
    'delete-task',
    {
      description: 'Supprimer définitivement une tâche',
      inputSchema: {
        task_id: z.string().describe('ID de la tâche à supprimer'),
      },
      outputSchema: {
        deleted: z.boolean(),
        title: z.string(),
      },
    },
    async ({ task_id }) => {
      const taskIndex = tasks.findIndex((t) => t.id === task_id);

      if (taskIndex === -1) {
        throw new Error(`Tâche avec l'ID "${task_id}" non trouvée`);
      }

      const deletedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);

      const output = {
        deleted: true,
        title: deletedTask.title,
      };

      return {
        content: [
          {
            type: 'text',
            text: `🗑️ Tâche supprimée: "${deletedTask.title}"`,
          },
        ],
        structuredContent: output,
      };
    }
  );
}

function listTasks(mcpServer: McpServer) {
  mcpServer.registerTool(
    'list-tasks',
    {
      description: 'Liste complète de toutes les tâches',
      inputSchema: {},
      outputSchema: {
        tasks: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().optional(),
            status: z.string(),
            created_at: z.string(),
            completed_at: z.string().optional(),
          })
        ),
        total: z.number(),
      },
    },
    async ({}) => {
      const content = {
        total: tasks.length,
        tasks: tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      };

      return {
        content: [
          {
            type: 'text',
            text: `Liste complète des tâches :\n${JSON.stringify(content, null, 2)}`,
          },
        ],
        structuredContent: content,
      };
    }
  );
}

function resourceListTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'tasks-all',
    'todo://tasks/all',
    {
      title: 'Toutes les tâches',
      description: 'Liste complète de toutes les tâches',
      mimeType: 'application/json',
    },
    async () => {
      const content = {
        total: tasks.length,
        tasks: tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      };
      return {
        contents: [
          {
            uri: 'todo://tasks/all',
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    }
  );
}

function resourceTodoTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'tasks-todo',
    'todo://tasks/status/todo',
    {
      title: 'Tâches à faire',
      description: 'Liste des tâches en attente',
      mimeType: 'application/json',
    },
    async () => {
      const todoTasks = tasks.filter((t) => t.status === 'todo');
      const content = {
        status: 'todo',
        count: todoTasks.length,
        tasks: todoTasks,
      };
      return {
        contents: [
          {
            uri: 'todo://tasks/status/todo',
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    }
  );
}

function resourceWIPTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'tasks-in-progress',
    'todo://tasks/status/in-progress',
    {
      title: 'Tâches en cours',
      description: 'Liste des tâches en cours de réalisation',
      mimeType: 'application/json',
    },
    async () => {
      const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
      const content = {
        status: 'in-progress',
        count: inProgressTasks.length,
        tasks: inProgressTasks,
      };
      return {
        contents: [
          {
            uri: 'todo://tasks/status/in-progress',
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    }
  );
}

function resourceDoneTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'tasks-done',
    'todo://tasks/status/done',
    {
      title: 'Tâches terminées',
      description: 'Liste des tâches complétées',
      mimeType: 'application/json',
    },
    async () => {
      const doneTasks = tasks.filter((t) => t.status === 'done');
      const content = {
        status: 'done',
        count: doneTasks.length,
        tasks: doneTasks,
      };
      return {
        contents: [
          {
            uri: 'todo://tasks/status/done',
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    }
  );
}

function resourceStatsTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'stats-summary',
    'todo://stats/summary',
    {
      title: 'Statistiques',
      description: 'Résumé et métriques de productivité',
      mimeType: 'application/json',
    },
    async () => {
      const total = tasks.length;
      const todoCount = tasks.filter((t) => t.status === 'todo').length;
      const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
      const doneCount = tasks.filter((t) => t.status === 'done').length;
      const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

      const content = {
        total_tasks: total,
        by_status: {
          todo: todoCount,
          in_progress: inProgressCount,
          done: doneCount,
        },
        completion_rate_percent: completionRate,
        generated_at: new Date().toISOString(),
      };
      return {
        contents: [
          {
            uri: 'todo://stats/summary',
            mimeType: 'application/json',
            text: JSON.stringify(content, null, 2),
          },
        ],
      };
    }
  );
}

function resourceExportCSVTasks(mcpServer: McpServer) {
  mcpServer.registerResource(
    'export-csv',
    'todo://export/csv',
    {
      title: 'Export CSV',
      description: 'Toutes les tâches au format CSV',
      mimeType: 'text/csv',
    },
    async () => {
      const csvHeader = 'id,title,description,status,created_at,completed_at';
      const csvRows = tasks.map((task) => {
        const description = (task.description || '').replace(/"/g, '""'); // Escape quotes
        return `"${task.id}","${task.title}","${description}","${task.status}","${task.created_at}","${task.completed_at || ''}"`;
      });
      const csvContent = [csvHeader, ...csvRows].join('\n');
      return {
        contents: [
          {
            uri: 'todo://export/csv',
            mimeType: 'text/csv',
            text: csvContent,
          },
        ],
      };
    }
  );
}

export function todolist(mcpServer: McpServer) {
  // Tools
  createTask(mcpServer);
  updateTask(mcpServer);
  deleteTask(mcpServer);
  listTasks(mcpServer);

  // Resources
  resourceListTasks(mcpServer);
  resourceTodoTasks(mcpServer);
  resourceWIPTasks(mcpServer);
  resourceDoneTasks(mcpServer);
  resourceStatsTasks(mcpServer);
  resourceExportCSVTasks(mcpServer);
}
