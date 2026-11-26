import { planDisclosure } from "@/server/applink/config";
import { JoinFlow } from "./join-flow";

export const dynamic = "force-dynamic";

export default function JoinPage() {
  const plan = planDisclosure();
  const mock = process.env.APPLINK_DEV_MOCK === "1" && process.env.NODE_ENV !== "production";
  return <JoinFlow plan={plan} mock={mock} />;
}
