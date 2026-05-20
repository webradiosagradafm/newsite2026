import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

interface Episode {
  id: string;
  title: string;
  presenter: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
  image: string;
}

interface ProgramMiniPageProps {
  program: any
  queue: any[]
  liveMetadata: any
  trackHistory: any[]
  isPlaying: boolean
  onListenClick: () => void
  onBack: () => void
  onViewSchedule: () => void
}

export default function ProgramMiniPage({
  program,
  queue,
  liveMetadata,
  trackHistory,
  isPlaying,
  onListenClick,
  onBack,
  onViewSchedule
}: ProgramMiniPageProps) {
  return null;
}