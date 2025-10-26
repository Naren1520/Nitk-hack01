import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty' | 'admin';
  avatarUrl?: string;
  studentId?: string;
  department?: string;
  yearOfStudy?: number;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  emergencyContact?: string;
  emergencyPhone?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'student' | 'faculty' | 'admin';
  public avatarUrl?: string;
  public studentId?: string;
  public department?: string;
  public yearOfStudy?: number;
  public phone?: string;
  public address?: string;
  public dateOfBirth?: Date;
  public emergencyContact?: string;
  public emergencyPhone?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'faculty', 'admin'),
      allowNull: false,
      defaultValue: 'student',
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    studentId: {
      type: DataTypes.STRING,
      unique: true,
    },
    department: {
      type: DataTypes.STRING,
    },
    yearOfStudy: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    emergencyContact: {
      type: DataTypes.STRING,
    },
    emergencyPhone: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;