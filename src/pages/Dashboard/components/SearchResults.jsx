export function SearchResults({ results }) {
  return (
    <div className="results-list"> 
   
      {results.map((result, id)=>{
        return <div key={id}>{result.uid}</div>
      })
    }
    </div>
  );
}
