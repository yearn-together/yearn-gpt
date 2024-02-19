import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React, { useEffect, useState } from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { Cooking } from "../../components/Common/Cooking";
import AgentInfo from "../../components/Agent/AgentInfo";
import AgentSessions from "../../components/Agent/AgentSessions";
import { useAuth } from "../../context/AuthContext";

export default function AgentPreview() {
  const [sessionId, setSessionId] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agentData, status: agentStatus } = useQuery(
    ["getAgentById", id],
    async () => {
      const response = await api.get(`/agent/${id}`);
      return response.data;
    }
  );

  const {
    data: sessionData,
    status: sessionStatus,
    refetch: refetchSession,
  } = useQuery(
    ["getSessionById", id, sessionId],
    async () => {
      const response = await api.get(`/agent/session`, {
        params: {
          agentId: id,
          sessionId: sessionId,
        },
      });
      return response.data;
    },
    {
      enabled: !!sessionId,
    }
  );

  const { isLogged } = useAuth();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (agentStatus === "error") {
      navigate("/");
    }
  }, [agentStatus]);

  useEffect(() => {
    if (agentData?.sessions && agentData.sessions.length > 0) {
      setSessionId(agentData.sessions[0].id);
    }
  }, [agentData]);

  useEffect(() => {
    if (sessionId) {
      refetchSession();
    }
  }, [sessionId, refetchSession]);

  return (
    <>
      {agentStatus === "loading" && (
        <div className="mx-auto my-3 w-full max-w-7xl">
          <SkeletonLoading />
        </div>
      )}
      {agentStatus === "success" && !agentData && <Cooking />}
      {agentStatus === "success" && agentData && (
        <div className="flex h-full w-full py-6 px-4">
          <AgentSessions
            sessionId={sessionId}
            sessions={agentData.sessions}
            agentName={agentData?.name || ""}
            botName={agentData?.name || ""}
            sessionMessage={sessionData?.messages}
            setSessionId={setSessionId}
          />
          <AgentInfo info={agentData} />
        </div>
      )}
      {agentStatus === "error" && (
        <div>An error occurred. Please try again later.</div>
      )}
    </>
  );
}
