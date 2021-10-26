import { useParams } from "react-router";

export const useParamGroupId = () => useParams<{ groupId: string }>().groupId;
