import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPointFilled, IconSchool } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { SkeletonTab } from "../../components/skeleton-tab";
import { WithFooter } from "../../components/with-footer";
import { useClass } from "../../hooks/use-class";
import { useIsClassTeacher } from "../../hooks/use-is-class-teacher";
import { getColorFromId } from "../../utils/color";
import { plural } from "../../utils/string";

const useTabIndex = () => {
  const router = useRouter();

  switch (router.pathname) {
    case `/classes/[id]`:
      return 0;
    case `/classes/[id]/members`:
      return 1;
    case `/classes/[id]/settings`:
      return 2;
  }
};

export const ClassLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useClass();

  const bg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const tabIndex = useTabIndex();

  return (
    <WithFooter>
      <Container maxW="5xl">
        <Stack spacing="0">
          <Skeleton w="full" h="32" rounded="2xl" isLoaded={!!data}>
            <Box
              w="full"
              h="32"
              bgGradient={`linear(to-tr, blue.400, ${getColorFromId(
                id || ""
              )})`}
              rounded="2xl"
            />
          </Skeleton>
          <Stack
            px={{ base: 0, sm: 6, md: 10 }}
            spacing="8"
            mt="-36px"
            zIndex={10}
          >
            <Center w="88px" h="88px" rounded="3xl" outlineColor={bg} bg={bg}>
              <Skeleton w="72px" h="72px" rounded="2xl" isLoaded={!!data}>
                <Center rounded="2xl" w="72px" h="72px" bg="white" shadow="2xl">
                  <Box color="gray.900">
                    <IconSchool size={36} />
                  </Box>
                </Center>
              </Skeleton>
            </Center>
            <Stack spacing="6">
              <Stack spacing="0">
                <Flex alignItems="center" minH="48px">
                  <SkeletonText
                    noOfLines={1}
                    isLoaded={!!data}
                    skeletonHeight="30px"
                  >
                    <Heading>{data?.name || "Placeholder class name"}</Heading>
                  </SkeletonText>
                </Flex>
                <Flex alignItems="center" h="21px">
                  <SkeletonText
                    noOfLines={1}
                    isLoaded={!!data}
                    skeletonHeight="12px"
                  >
                    <HStack fontSize="sm" color="gray.500" spacing="1">
                      <Text>
                        {plural(data?.studySets?.length || 0, "study set")}
                      </Text>
                      <IconPointFilled size={10} />
                      <Text>
                        {plural(data?.folders?.length || 0, "folder")}
                      </Text>
                    </HStack>
                  </SkeletonText>
                </Flex>
              </Stack>
              {data?.description && (
                <Text whiteSpace="pre-wrap">{data?.description}</Text>
              )}
              <Tabs borderColor={borderColor} isManual index={tabIndex}>
                <TabList gap="6">
                  <SkeletonTab isLoaded={!!data} href={`/classes/${id}`}>
                    Home
                  </SkeletonTab>
                  <HiddenTabWrapper index={1}>
                    <SkeletonTab
                      isLoaded={!!data}
                      href={`/classes/${id}/members`}
                    >
                      Members
                    </SkeletonTab>
                  </HiddenTabWrapper>
                  <HiddenTabWrapper index={2}>
                    <SkeletonTab
                      isLoaded={!!data}
                      href={`/classes/${id}/settings`}
                    >
                      Settings
                    </SkeletonTab>
                  </HiddenTabWrapper>
                </TabList>
                <TabPanels mt="6">{children}</TabPanels>
              </Tabs>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </WithFooter>
  );
};

interface HiddenTabWrapperProps {
  index: number;
}

const HiddenTabWrapper: React.FC<
  React.PropsWithChildren<HiddenTabWrapperProps>
> = ({ index, children }) => {
  const tabIndex = useTabIndex();
  const isTeacher = useIsClassTeacher();

  if (!isTeacher && tabIndex !== index) return null;

  return <>{children}</>;
};
