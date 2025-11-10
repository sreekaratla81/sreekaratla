import type { Metadata } from "next";
import { buildTrackMetadata, TrackPage } from "../_components/track-page";

type SearchParams = {
  tag?: string;
};

export const metadata: Metadata = buildTrackMetadata("tech");

type Props = {
  searchParams?: SearchParams;
};

export default function TechTrackPage({ searchParams }: Props) {
  return <TrackPage track="tech" searchParams={searchParams} />;
}
