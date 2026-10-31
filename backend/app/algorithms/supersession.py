import networkx as nx
from datetime import date, datetime
from typing import List, Dict, Any, Optional, Set

class SupersessionGraph:
    """
    F8 Supersession Graph using NetworkX DiGraph.
    Tracks document versions, circular replacements (u supersedes v),
    cycle detection via topological sort, and current valid policy resolution.
    """
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_document(self, doc_id: str, title: str, publish_date: str):
        self.graph.add_node(doc_id, title=title, publish_date=publish_date)

    def add_supersession(self, superseding_doc: str, superseded_doc: str, effective_date: str, quote: str = ""):
        """
        Edge u -> v means u supersedes v with effective_date(u)
        """
        self.graph.add_edge(
            superseding_doc,
            superseded_doc,
            effective_date=effective_date,
            quote=quote
        )

    def check_cycles(self) -> bool:
        """
        Detects if there is any circular replacement error using Kahn's topological sort.
        Returns True if a cycle exists (data contradiction), False if DAG is valid.
        """
        return not nx.is_directed_acyclic_graph(self.graph)

    def get_current_documents(self, reference_date: Optional[date] = None) -> List[str]:
        """
        A document v is current iff it has no incoming superseding edge u -> v
        whose effective_date <= today.
        """
        ref = reference_date or date.today()
        current = []

        for doc in self.graph.nodes:
            # Check all incoming edges (documents that supersede this doc)
            in_edges = self.graph.in_edges(doc, data=True)
            superseded = False
            for u, v, data in in_edges:
                eff_str = data.get("effective_date")
                if eff_str:
                    try:
                        eff_d = datetime.strptime(eff_str, "%Y-%m-%d").date()
                        if eff_d <= ref:
                            superseded = True
                            break
                    except Exception:
                        pass
            if not superseded:
                current.append(doc)

        return current

    def explain_chain(self, doc_id: str) -> List[Dict[str, Any]]:
        """
        Explains historical chain: what documents did doc_id supersede, or what superseded it.
        """
        if doc_id not in self.graph:
            return []

        chain = []
        # Documents superseded by this doc (outgoing edges)
        for _, superseded, data in self.graph.out_edges(doc_id, data=True):
            chain.append({
                "action": "supersedes",
                "target_doc": superseded,
                "effective_date": data.get("effective_date"),
                "quote": data.get("quote")
            })

        # Documents that supersede this doc (incoming edges)
        for superseding, _, data in self.graph.in_edges(doc_id, data=True):
            chain.append({
                "action": "superseded_by",
                "source_doc": superseding,
                "effective_date": data.get("effective_date"),
                "quote": data.get("quote")
            })

        return chain
