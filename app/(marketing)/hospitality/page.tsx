import type { Metadata } from "next";
import { buildTrackMetadata, TrackPage } from "../_components/track-page";

type SearchParams = {
  tag?: string;
};

export const metadata: Metadata = buildTrackMetadata("hospitality");

type Props = {
  searchParams?: SearchParams;
};

export default function HospitalityTrackPage({ searchParams }: Props) {
  return <TrackPage track="hospitality" searchParams={searchParams} />;
}
