import { Octokit } from "octokit";
import { ChangeEvent, useEffect, useState } from "react";
import RepoCard from "./components/RepoCard";
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
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearRepos, setLoading, setRepos, setSearch } from "./store/repoSlice";
import { toaster, Toaster } from "./components/ui/toaster";

function App() {
  const [page, setPage] = useState(1);

  const repos = useAppSelector((state) => state.repo.repos);
  const loading = useAppSelector((state) => state.repo.loading);
  const search = useAppSelector((state) => state.repo.search);
  const pageSize = useAppSelector((state) => state.repo.itemsPerPage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== "") fetchRepos();
      else {
        dispatch(clearRepos());
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_KEY,
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value));
  };

  const fetchRepos = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await octokit.request(`GET /users/${search}/repos`, {
        owner: { search },
        per_page: 20,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      dispatch(setRepos(data));
      dispatch(setLoading(false));
    } catch (error) {
      if (error instanceof Error) {
        toaster.create({
          title: "Error",
          description: "User not found",
          type: "error",
          duration: 6000,
        });
        dispatch(setLoading(false));
      }
    }
  };

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleItems = repos.slice(startRange, endRange);

  return (
    <Theme appearance="light">
      <Box m={"10px"}>
        <Heading size={"4xl"}>GitHub API App</Heading>
      </Box>
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
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 3, "2xl": 4 }}
                gap={{ base: "24px", md: "40px" }}
              >
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
        <Toaster />
      </Box>
    </Theme>
  );
}

export default App;
