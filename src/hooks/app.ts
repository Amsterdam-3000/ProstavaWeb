import { useMemo } from "react";
import { useParams, useLocation } from "react-router";

export const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

export const useParamGroupId = () => useParams<{ groupId: string }>().groupId;
export const useParamUserId = () => useParams<{ userId: string }>().userId;
export const useParamProstavaId = () => useParams<{ prostavaId: string }>().prostavaId;

export const useQueryIsRequest = () => Boolean(useQuery().get("isRequest"));
export const useQueryLayout = () => String(useQuery().get("layout"));
