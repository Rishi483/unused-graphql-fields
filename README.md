# unused-graphql-fields


`unused-graphql-fields` is a utility package for detecting unused fields in your GraphQL queries. It provides custom hooks, `useTrackedQuery`, `useTrackedLazyQuery` and `useTrackedData` as alternatives to Apollo Client's hooks. Additionally, the package includes a component, `UnusedFieldsViewer` and `TreeViewRenderer` which can be used to visualize the unused fields in your application. Also it provides `clearAllEntries` function which can be invoked to clear the list of queries from the viewer components.

## Installation

```sh
npm install unused-graphql-fields
```
## Environment Setup
To ensure the proper functionality of the hook, it is essential to set up an environment variable named `NODE_ENV`. This variable should be configured to either "development" or "production" based on your current environment.

In your .env.local file:
```
 NODE_ENV="development"
```
or
```
NODE_ENV="production"
```

## Usage
Replace your existing Apollo Client hooks with the custom hooks provided by unused-graphql-fields.

**For useTrackedQuery**
```
import { useTrackedQuery } from 'unused-graphql-fields';
import { gql } from '@apollo/client';

const MY_QUERY = gql`
  query MyQuery {
    field1
    field2
    field3
  }
`;

const MyComponent = () => {
  const { data, loading, error } = useTrackedQuery(MY_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>Field 1: {data.field1}</p>
      <p>Field 2: {data.field2}</p>
    </div>
  );
};
```
**For useTrackedLazyQuery**
```
import { useTrackedLazyQuery } from 'unused-graphql-fields';
import { gql } from '@apollo/client';

const MY_QUERY = gql`
  query MyQuery {
    field1
    field2
    field3
  }
`;

const MyComponent = () => {
  const { getQuery,{loading,data} } = useTrackedLazyQuery(MY_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>Field 1: {data.field1}</p>
      <p>Field 2: {data.field2}</p>
      <button onClick={()=>getQuery()}>load</button>
    </div>
  );
};
```
**For useTrackedData** 
```
import { useLazyQuery } from "@apollo/client";
import {useTrackedData} from "unused-graphql-fields"

const useCustomLazyQuery = function(query,options){
  const [getQuery, result] = useLazyQuery(query, options);

  const { data } = result;

  const proxyData=useTrackedData(data,query);

  return [getQuery, { ...result, data: proxyData }];
};

export default useCustomLazyQuery;

```

**To visualize unused fields, include the `UnusedFieldsViewer` component at the top level of your application.**
```
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient'; // assuming you have set up your Apollo Client
import { UnusedFieldsViewer } from 'unused-graphql-fields';
import App from './App';

const Root = () => (
  <ApolloProvider client={client}>
    <UnusedFieldsViewer />
    <App />
  </ApolloProvider>
);

export default Root;
```
**To visualize unused fields using the TreeViewRenderer component, you can use it like this. Additionally, it accepts an optional prop `showClearAllButton`, which can be set to true or false to show the `Clear All` button for clearing the list from the viewer component.**

```
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient'; // assuming you have set up your Apollo Client
import { TreeViewRenderer } from 'unused-graphql-fields';
import App from './App';

const Root = () => (
  <ApolloProvider client={client}>
    <TreeViewRenderer showClearAllButton={true} />
    <App />
  </ApolloProvider>
);

export default Root;
```