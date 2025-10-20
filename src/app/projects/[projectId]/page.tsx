import ProjectView from "@/modules/pojects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AsyncWrapper } from "@/components/async-wrapper";
import ProjectNotFoundErrorFallback from "@/modules/pojects/ui/components/project-not-found-error-fallback";
import ProjectPageLoadingFallback from "@/modules/pojects/ui/components/project-page-loading";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AsyncWrapper
        errorFallback={<ProjectNotFoundErrorFallback />}
        fallback={<ProjectPageLoadingFallback />}
      >
        <ProjectView projectId={projectId} />
      </AsyncWrapper>
    </HydrationBoundary>
  );
};

export default page;
