import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { DsTable } from "../../components/Bot/DS/DsTable";

export default function BotDSRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: botData, status } = useQuery(
    ["getBotDS", param.id],
    async () => {
      const response = await api.get(`/bot/${param.id}/source`);
      return response.data as {
        sources: {
          id: string;
          type: string;
          content: string;
          status: string;
          disabled: boolean;
          source_chars: number;
        }[];
        sourceCharsUsed: number;
        totalSourceChars: number;
      };
    },
    {
      refetchInterval: 1000,
    }
  );

  React.useEffect(() => {
    if (status === "error") {
      navigate("/");
    }
  }, [status]);

  return (
    <div className="mx-auto my-3 w-full max-w-7xl">
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && (
        <>
          <DsTable {...botData} />
        </>
      )}
    </div>
  );
}
