import { Octokit } from "octokit";
import { ChangeEvent, useState } from "react";
import RepoCard from "./components/RepoCard";
import { IRepo } from "./types";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Theme,
} from "@chakra-ui/react";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<IRepo[]>([]);

  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_KEY,
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const fetchRepos = async () => {
    setLoading(true);
    const { data } = await octokit.request(`GET /users/${search}/repos`, {
      owner: { search },
      per_page: 20,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    setRepos(data);
    setLoading(false);
  };

  return (
    <Theme appearance="light">
      <header>
        <Heading size={"4xl"} m={"10px"}>
          GitHub API App
        </Heading>
      </header>
      <Box m={"3rem 3rem"}>
        <HStack>
          <Input
            placeholder="Enter username"
            value={search}
            onChange={handleSearch}
          />
          <Button onClick={fetchRepos} colorPalette={"teal"}>
            Search
          </Button>
        </HStack>
        <Box mt={"3rem"}>
          {loading ? (
            <Flex justify={"center"}>
              <Spinner />
            </Flex>
          ) : (
            <SimpleGrid columns={[2, null, 3]} gap="20px">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </Theme>
  );
}

export default App;
