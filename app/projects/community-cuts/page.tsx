import { permanentRedirect } from "next/navigation";

export default function LegacyCommunityCutsRoute() {
  permanentRedirect("/events/community-cuts");
}
