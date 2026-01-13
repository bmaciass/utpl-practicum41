# Crud Implementation in the UI

## Context

The UI is an application built using Remix + Typescript. The application is mostly a SPA CSR. The naming convention for the routes is a flat layout. This UI is meant to be deployed in Cloudflare.

## Goal

Create CRUD pages for each domain listed.

## Domains

- InstitutionalPlan
- Institution
- Program
- Project
- ProjectGoal

Domains are located at packages/api/src/domain

In order to know how they are related in terms of data, you can check packages/db/src/schema/tables/

From now on, the word domain can also be used as resource.

## Manipulating data

Each resource should have its own hook that uses apollo graphql to fetch the information. You can check the schema at `packages/shared/graphql/api-schema.graphql`. So, there must exist an individual hook for getting the list of resources, another hook for getting an unique element and a hook to update a resource. There are some hooks already created at `packages/ui/app/hooks/`.

## Functionality

### Navigation

Every page that holds a domain can be navigated by changing the url.

**IMPORTANT:** All URL parameters representing resource identifiers must use the naming convention `$uid` or `$resourceUid` (e.g., `$uid`, `$institutionUid`, `$programUid`). This maintains consistency with the backend.

#### Reading a list of resources
The url must be composed of plural nouns. For instance, if the user wants to see the institutions, they may navigate to `/institutions`.

#### Reading a unique resource
The url must be composed of a singular noun with the UID. For instance, in order to open a unique element, this will be represented on the url by its UID. For instance: `/institution/dsfj123`.

#### Creating a new resource
The url must use the word `new` when creating a new resource. For instance, when creating a new institution the user should navigate to `/institution/new`


### UI Structure and Components

**Architecture Pattern:**

To maintain clean, testable code, we follow a three-layer component architecture:

1. **Atomic Components** - Small, reusable UI components (Card, List, Form)
2. **Page Components** - Parent components that compose atomic components and handle all business logic, data fetching, and routing
3. **Route Files** - Thin wrappers that only handle authentication and render page components wrapped in ClientOnly

**Example structure for a resource:**
```
components/pages/resource/
  - ResourceCard.tsx         (atomic - clickable card)
  - ResourceList.tsx         (atomic - list with separators)
  - ResourceForm.tsx         (atomic - form with validation)
  - ResourcesPage.tsx        (page - list page with layout)
  - ResourceDetailPage.tsx   (page - detail page with delete button)
  - ResourceNewPage.tsx      (page - new page with form)

routes/
  - _primary.resources.tsx          (thin route wrapper)
  - _primary.resources.$uid.tsx     (thin route wrapper)
  - _primary.resources.new.tsx      (thin route wrapper)
```

**Route files should be minimal:**
```tsx
export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <ResourcesPage />}</ClientOnly>
}
```

All logic (useParams, hooks, error handling, navigation) belongs in Page Components, not routes.

#### Lists

There should exist a unique component on its own file that will call their corresponding list hook. This component will render a list of clickable components. Clicking in one of them should perform a navigation to the resource's detail page.


#### Forms

Forms will be used when it comes to showing detailed information about a resource. This form can be editable. There is no need to manage a editable button; it will always be editable. The form should live on its own file. The form should come with two buttons: Cancel and save. Cancelling means going back to the previous page. Saving means that the component will call or use their corresponding hook that updates an existing resource or creates a new resource. The component must decide which operation it will perform based on the uid received as prop. If the uid is string, the component will fetch data using their corresponding hook.

#### List page structure

This page must be inside a container with a flex display with column direction. This page must include a button `New` located at the right that will open the detailed resource page with an empty form (it will navigate to `/<resource>/new`). Below the button,  it should render the list of resources.


#### Resource page structure

The page for the resource's details must have a delete button at the top right. The delete button will open a dialog in order to confirm the soft-deletion. After the operation is completed, the page should navigate back to the list. This operation should be done by their corresponding update hook. Below the button it should render the form component.
If the resource has nested components; for instance, a single project can have multiple goals; then, a button with a text `View Goals` must appear at the top left of the page. When the user clicks `View Goals` the page must redirect them to `project/xyz/goals`.


#### Actions

Every operation must be notified to the user as a notification. Each notification could be closed. The notification should use the `Alert` component and must be shown as follows:
- For a notification of deletion, the notification must be shown on top of the list. We can use URL parameters to control when to show a successful or failed notification since the page always navigates back.
- For a notification of save or update operation, the notification must be shown on top of the form.