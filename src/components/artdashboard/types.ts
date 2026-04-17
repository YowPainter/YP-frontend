export type Work = {
  id: string;
  title: string;
  type: 'image' | 'video';
  bg: string;
  duration?: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  desc: string;
  tags: string[];
};

export type Article = {
  id: string;
  title: string;
  type: string;
  price: string;
  sold: boolean;
  bg: string;
  handleColor: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  desc: string;
  tags: string[];
};
