import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';

// 建立 SQLite 连接
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: false,
});

// User 表 (积分)
export const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  }
});

// Project 表
export const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  basicType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nodesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Canvas 表
export const Canvas = sequelize.define('Canvas', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nodes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  edges: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  }
});

// GenerationJob 表 (任务)
export const GenerationJob = sequelize.define('GenerationJob', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nodeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  resultUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cost: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  }
});

// 设置关联关系
Project.hasOne(Canvas, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Canvas.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(GenerationJob, { foreignKey: 'projectId', onDelete: 'CASCADE' });
GenerationJob.belongsTo(Project, { foreignKey: 'projectId' });

// 初始化数据库同步
let isSynced = false;
export async function syncDatabase() {
  if (!isSynced) {
    await sequelize.sync();
    // 如果没有用户，初始化一个默认用户 (提供初始积分)
    const count = await User.count();
    if (count === 0) {
      await User.create({ id: 'default_user', points: 100 });
    }
    isSynced = true;
  }
}