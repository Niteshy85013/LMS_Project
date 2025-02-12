import React, { useState } from 'react';

import CreateItem from './CategoryForm';
import ItemList from './CategoryList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <CreateItem fetchItems={handleRefresh} />
      <ItemList/>
    </div>
  );
}

export default App;