import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface EventAttributes {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  startTime: Date;
  endTime: Date;
  organizerId: string;
  department?: string;
  isPublic: boolean;
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  tags?: string[];
  imageUrl?: string;
}

class Event extends Model<EventAttributes> implements EventAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public eventType!: string;
  public location!: string;
  public startTime!: Date;
  public endTime!: Date;
  public organizerId!: string;
  public department?: string;
  public isPublic!: boolean;
  public maxAttendees?: number;
  public registrationRequired!: boolean;
  public registrationDeadline?: Date;
  public tags?: string[];
  public imageUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    department: {
      type: DataTypes.STRING,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
    },
    registrationRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    registrationDeadline: {
      type: DataTypes.DATE,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);

Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

export default Event;