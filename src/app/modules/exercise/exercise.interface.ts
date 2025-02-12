export type TExercise = {
  exerciseName: string;
  gifImage: string;
  description: string;
  isDeleted?: boolean;
  gymEquipmentNeeded: 'yes' | 'no';
};
