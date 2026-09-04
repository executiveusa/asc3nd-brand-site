import type { Metadata } from "next";
import MeetingBrief from "./MeetingBrief";

export const metadata: Metadata = {
  title: "ASC3ND Founder Review",
  description: "Interactive ASC3ND founder meeting brief and brand decision walkthrough.",
};

export default function ReviewPage() {
  return <MeetingBrief />;
}
