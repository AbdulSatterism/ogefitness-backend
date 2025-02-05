export interface DayWorkout {
  isCompleted: boolean;
  day: number;
  warmUp: WorkoutSection;
  mainWorkout: WorkoutSection;
  coolDown: WorkoutSection;
}

export interface WorkoutSection {
  duration: number;
  exercises: string[];
}

export interface IWorkoutPlan {
  planName: string;
  description: string;
  image?: string;
  workouts: DayWorkout[];
}

/*
{
  "planName": "Full-Body Strength Training",
  "description": "A plan designed to build strength and establish consistency over a period of time.",
  "image": "image-url",
  "workouts": [
    {
      "isCompleted": true,
      "day": "1",
      "warmUp": {
        "duration": 5,
        "exercises": ["exerciseId1", "exerciseId2"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["exerciseId3", "exerciseId4", "exerciseId5"]
      },
      "coolDown": {
        "duration": 5,
        "exercises": ["exerciseId6"]
      }
    },
    {
      "isCompleted": false,
      "day": "2",
      "warmUp": {
        "duration": 5,
        "exercises": ["exerciseId1", "exerciseId2"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["exerciseId3", "exerciseId4", "exerciseId5"]
      },
      "coolDown": {
        "duration": 5,
        "exercises": ["exerciseId6"]
      }
    },
    {
      "isCompleted": false,
      "day": "3",
      "warmUp": {
        "duration": 5,
        "exercises": ["exerciseId1", "exerciseId2"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["exerciseId3", "exerciseId4", "exerciseId5"]
      },
      "coolDown": {
        "duration": 5,
        "exercises": ["exerciseId6"]
      }
    },
    {
      "isCompleted": false,
      "day": "4",
      "warmUp": {
        "duration": 5,
        "exercises": ["exerciseId1", "exerciseId2"]
      },
      "mainWorkout": {
        "duration": 30,
        "exercises": ["exerciseId3", "exerciseId4", "exerciseId5"]
      },
      "coolDown": {
        "duration": 5,
        "exercises": ["exerciseId6"]
      }
    }
  ]
}

*/
