import { Types } from 'mongoose';

export interface DayWorkout {
  isCompleted: boolean;
  day: number;
  warmUp: WorkoutSection;
  mainWorkout: WorkoutSection;
  coolDown: WorkoutSection;
}

export interface WorkoutSection {
  duration: number;
  exercises: Types.ObjectId[]; //TODO: update exercises types object id
}

export interface IWorkoutPlan {
  createdBy: string;
  planName: string;
  description: string;
  image?: string;
  rating: number;
  workouts: DayWorkout[];
}

/*
{
  "planName": "Lost weight",
  "description": "A plan designed to build strength and establish consistency over a period of time.",
  "workouts": [
    {
      "isCompleted": true,
      "day": 1,
      "warmUp": {
        "duration": 5,
        "exercises": ["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["67a09abb8a90723230ed9d2a","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "coolDown": {
        "duration": 5,
        "exercises":["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", ]
      }
    },
    {
      "isCompleted": true,
      "day": 2,
      "warmUp": {
        "duration": 5,
        "exercises": ["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["67a09abb8a90723230ed9d2a","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "coolDown": {
        "duration": 5,
        "exercises":["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", ]
      }
    },
    {
      "isCompleted": true,
      "day": 3,
      "warmUp": {
        "duration": 5,
        "exercises": ["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["67a09abb8a90723230ed9d2a","67a08c8ab09e5ab6ca493347", "67a096038a90723230ed9d26"]
      },
      "coolDown": {
        "duration": 5,
        "exercises":["67a09abb8a90723230ed9d2a","67a094dfe3434cbf5efd4fe8","67a08c8ab09e5ab6ca493347", ]
      }
    }
  ]
}

*/
