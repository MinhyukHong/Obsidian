
크루스칼 알고리즘은 *가장 적은 비용으로 모든 노드를 연결* 하기 위해 사용하는 알고리즘이다. 최소 비용 신장 트리를 만들기 위한 대표 알고리즘이라 할 수 있다. 흔히 여러 개의 도시가 있을 때 **각 도시를 도로를 이용해 연결하고자 할 때, 비용을 최소한으로 하고자 할 때** 실제로 적용되는 알고리즘이다.

> 노드 = 정점 = 도시: 그래프 상에서의 원에 해당
> 간선 = 거리 = 비용: 그래프 상에서의 선에 해당

아래의 그래프에서 **노드**는 7개이고, **간선**은 11개이다.
![Figure 1](Kruskal_1.png)


> "간선을 거리가 짧은 순서대로 그래프에 포함시키면 어떨까?"

일단 모든 노드를 최대한 적은 비용으로 '연결만' 시키면 되기 때문에 모든 간선 정보를 오름차순으로 정렬한 뒤에 비용이 적은 간선부터 그래프에 포함시키면 된다.

![Figure 2](Kruskal_2.png)

위와 같이 노드 1부터 7까지 연결된 모든 간선 정보를 저장한다. 간선은 총 11개가 존재한다.

![Figure 3](Kruskal_3.png)

위와 같이 모든 간선들을 '거리(비용)'를 기준으로 먼저 오름차순 정렬을 수행했다. 이제부터 다음의 알고리즘에 맞게 그래프를 연결하면 *최소 비용으로 모든 노드를 연결한 그래프* 인 ==최소 비용 신장 트리==가 만들어진다.

> [!note] 알고리즘
> 1. 정렬된 순서에 맞게 그래프에 포함시킨다.
> 2. 포함시키기 전에는 사이클 테이블을 확인한다.
> 3. 사이클을 형성하는 경우 간선을 포함하지 않는다.

![Figure 4](Kruskal_4.png)

```
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

// 부모 노드를 가져옴
int getParent(int set[], int x) {
	if(set[x] == x) return x;
	return set[x] = getParent(set, set[x]);
}

// 부모 노드를 병합
void unionParent(int set[], int a, int b) {
	a = getParent(set, a);
	b = getParent(set, b);
	// 더 숫자가 작은 부모로 병합
	if(a < b) set[b] = a;
	else set[a] = b;
}

// 같은 부모를 가지는지 확인
int find(int set[], int a, int b) {
	a = getParent(set, a);
	b = getParent(set, b);
	if(a == b) return 1;
	else return 0;
}

// 간선 클래스 선언
class Edge {
public:
	int node[2];
	int distance;
	Edge(int a, int b, int distance) {
		this->node[0] = a;
		this->node[1] = b;
		this->distance = distance;
	}
	bool operator <(Edge &edge) {
		return this->distance < edge.distance;
	}
};

int main() {
	int n = 7;
	int m = 11;
	
	vector<Edge> v;
	v.push_back(Edge(1, 7, 12));
	v.push_back(Edge(1, 4, 28));
	v.push_back(Edge(1, 5, 17));
	v.push_back(Edge(2, 4, 24));
	v.push_back(Edge(2, 5, 62));
	v.push_back(Edge(3, 5, 20));
	v.push_back(Edge(3, 6, 37));
	v.push_back(Edge(4, 7, 13));
	v.push_back(Edge(5, 6, 45));
	v.push_back(Edge(5, 7, 73));
	
	// 간선의 비용으로 오름차순 정렬
	sort(v.begin(), v.end());
	
	// 각 정점이 포함된 그래프가 어디인지 저장
	int set[n];
	for(int i = 0; i < n; i++) {
		set[i] = i;
	}
	
	// 거리의 합을 0으로 초기화
	int sum = 0;
	for(int i = 0; i < v.size(); i++) {
		// 동일한 부모를 가지지 않는 경우, 즉 사이클이 발생하지 않을 때만 선택
		if(!find(set, v[i].node[0] - 1, v[i].node[1] - 1)) {
			sum += v[i].distance;
			unionParent(set, v[i].node[0] - 1, v[i].node[1] - 1);
		}
	}
	
	printf("%d\n", sum);
}
```

크루스칼 알고리즘의 시간 복잡도는 정렬 알고리즘과 동일하다.