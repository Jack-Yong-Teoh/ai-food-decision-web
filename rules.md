Rules to follow during development:

1. No in-line styling / css, everything must be in the .scss file. If you need to add a new style, add it to the corresponding .scss file and use the className to apply it.
2. The scss strictly follows the BEM naming convention. refer to teh samples in the style folder.
3. Do not use any html tags directly, div, span is allowed, but not p, h1, h2, h3, li, b, img etc. Refer to the Ant Design for the components to use.
4. Do not create new components without permission, if you need to create a new component, please consult with the team first.
5. Always use the existing components as much as possible, do not create new ones
6. Do not use any third-party libraries without permission, if you need to use a new library (DO NOT modify the package.json / install anything), please consult with the team first.
7. Always write clean and maintainable code, follow the existing code style and structure.
8. Always check and test your code using yarn lint --fix to make sure there are no linting errors before committing.
9. For media queries, use the existing breakpoints defined in the scss variables, do not create new breakpoints without permission.
10. Images should be optimized for web, only .webp and .svg is allowed, and should be placed in the assets folder (refer to the format), do not import images directly from the src folder. Use the Image component from Ant Design to display images, do not use the img tag directly.
11. Every API call should have error handling, use the handleApiError function to handle errors and display appropriate messages to the user.
12. Every API call should have loading state, use the useState hook to manage loading state and display appropriate loading indicators to the user.
13. Every API functions should be placed in the services/api folder, and should be organized by module (e.g. user, wallet, etc.), do not place API functions in the components or other folders (refer to how its done).
14. Always use the useAppSelector and useAppDispatch hooks to interact with the Redux store
15. Always use the useEffect hook to manage side effects, do not use it for data fetching, use a separate function for data fetching and call it inside the useEffect hook.
16. After completing the task, open a pull request into develop branch and request for code review, do not merge the code yourself, wait for the approval from the team (format the pull request title and description appropriately, the branch name should be in the format (feature/ticket-number, e.g feature/FSD-12)).
