export type TAppointment = {
  title: string;
  description: string;
  image: string;
  price: number;
  availableTimes: string[];
  status?: boolean;
};
