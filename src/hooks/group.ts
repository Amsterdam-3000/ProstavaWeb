import { useParams } from "react-router";

export const useParamGroupId = () => Number(useParams<{ groupId: string }>().groupId);