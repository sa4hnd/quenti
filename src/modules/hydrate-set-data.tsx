import React from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { SetData } from "../interfaces/set-data";
import {
  createExperienceStore,
  ExperienceContext,
  ExperienceStore,
  ExperienceStoreProps,
} from "../stores/use-experience-store";
import { Loading } from "../components/loading";

export const HydrateSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  if (!data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
};

interface ContextLayerProps {
  data: SetData;
}

interface SetContextProps {
  data: SetData;
}

export const SetContext = React.createContext<SetContextProps | undefined>(
  undefined
);

const ContextLayer: React.FC<React.PropsWithChildren<ContextLayerProps>> = ({
  data,
  children,
}) => {
  const getVal = (data: SetData): Partial<ExperienceStoreProps> => ({
    shuffleFlashcards: data.studySetExperiences[0]!.shuffleFlashcards,
    starredTerms: data.studySetExperiences[0]!.starredTerms.map(
      (x) => x.termId
    ),
  });

  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore(getVal(data));
  }

  React.useEffect(() => {
    storeRef.current?.setState(getVal(data));
  }, [data]);

  return (
    <SetContext.Provider value={{ data }}>
      <ExperienceContext.Provider value={storeRef.current}>
        {children}
      </ExperienceContext.Provider>
    </SetContext.Provider>
  );
};
