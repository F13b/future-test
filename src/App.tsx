import { Octokit } from "octokit";
import { ChangeEvent, useEffect, useState } from "react";
import RepoCard from "./components/RepoCard";
import { IRepo } from "./types";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Theme,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./components/ui/pagination";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<IRepo[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== "") fetchRepos();
      else {
        setRepos([]);
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

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

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleItems = repos.slice(startRange, endRange);

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
        </HStack>
        <Box mt={"3rem"}>
          {loading ? (
            <Flex justify={"center"}>
              <Spinner />
            </Flex>
          ) : (
            <>
              <SimpleGrid columns={[2, null, 3]} gap="20px">
                {visibleItems.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </SimpleGrid>
              {visibleItems.length != 0 ? (
                <Flex justify={"center"} mt={"3rem"}>
                  <PaginationRoot
                    page={page}
                    count={repos.length}
                    pageSize={pageSize}
                    onPageChange={(e) => setPage(e.page)}
                  >
                    <HStack>
                      <PaginationPrevTrigger />
                      <PaginationItems />
                      <PaginationNextTrigger />
                    </HStack>
                  </PaginationRoot>
                </Flex>
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </Box>
    </Theme>
  );
}

export default App;
