import type { Metadata } from "next";
import { buildTrackMetadata, TrackPage } from "../_components/track-page";

type SearchParams = {
  tag?: string;
};

export const metadata: Metadata = buildTrackMetadata("leadership");

type Props = {
  searchParams?: SearchParams;
};

export default function LeadershipTrackPage({ searchParams }: Props) {
  return <TrackPage track="leadership" searchParams={searchParams} />;
}
