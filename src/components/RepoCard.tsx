import { FC } from "react";
import { IRepo } from "../types";
import { Card, Heading, Link, Text } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";

type RepoCardProps = {
  repo: IRepo;
};

const RepoCard: FC<RepoCardProps> = ({ repo }) => {
  return (
    <Card.Root>
      <Card.Header>
        <Heading>{repo.name}</Heading>
        <Text>{repo.stargazers_count} ⭐</Text>
      </Card.Header>
      <Card.Body>{repo.description}</Card.Body>
      <Card.Footer justifyContent="flex-end">
        <span>{repo.updated_at}</span>
        <Link
          href={repo.html_url}
          variant="plain"
          colorPalette={"teal"}
          target="_blank"
        >
          Go to repo <LuExternalLink />
        </Link>
      </Card.Footer>
    </Card.Root>
  );
};

export default RepoCard;
