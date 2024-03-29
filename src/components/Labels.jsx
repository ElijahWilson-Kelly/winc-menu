import { Flex, Text } from "@chakra-ui/react";

/*
  Renders a list of labels all with a given styling into a flexbox
    Props -
      labels - {array}
      ...styling - {object} ~ styles to be applied to the labels i.e. background color
*/
export const Labels = ({ labels, ...styling }) => {
  return (
    <Flex gap={2} wrap={"wrap"}>
      {labels.map((label) => (
        <Text
          key={label}
          borderRadius={5}
          p={1}
          fontWeight={"extrabold"}
          color={"gray.600"}
          fontSize={"2xs"}
          {...styling}
        >
          {label}
        </Text>
      ))}
    </Flex>
  );
};
