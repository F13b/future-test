import { FC } from "react";
import { IRepo } from "../types";

type RepoCardProps = {
  repo: IRepo;
};

const RepoCard: FC<RepoCardProps> = ({ repo }) => {
  return (
    <div className="border border-black">
      <p>{repo.name}</p>
      <p>{repo.description}</p>
      <div>
        <span>{repo.stargazers_count}⭐</span>
        <span>Last update at {repo.updated_at}</span>
        <a href={repo.html_url} target="_blank">
          Go to repo
        </a>
      </div>
    </div>
  );
};

export default RepoCard;
