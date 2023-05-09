"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post?._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };
    fetchPrompts();
  }, []);

  const handleFilterPrompts = useCallback(
    (input) => {
      const regex = new RegExp(input, "i"); // 'i' flag for case-insensitive search
      return posts.filter(
        (item) =>
          regex.test(item.creator.username) ||
          regex.test(item.tag) ||
          regex.test(item.prompt)
      );
    },
    [posts]
  );

  const handleSearchChange = useCallback((e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = handleFilterPrompts(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    );
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = handleFilterPrompts(tagName);
    setSearchResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for tags or users"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};
export default Feed;
