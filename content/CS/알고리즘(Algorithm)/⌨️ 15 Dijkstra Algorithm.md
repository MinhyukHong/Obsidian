
다익스트라 알고리즘은 다이나믹 프로그래밍을 활용한 대표적인 ==최단 경로 탐색 알고리즘==이다. 흔히 인공위성 GPS 소프트웨어 등에서 가장 많이 사용된다. 다익스트라 알고리즘은 특정한 하나의 정점에서 다른 모든 정점으로 가는 최단 경로를 알려준다. 다만 이 때 음의 간선을 포함할 수 없다. 물론 현실 세계에서는 음의 간선이 존재하지 않기 때문에 다익스트라는 현실 세계에 사용하기 매우 적합한 알고리즘 중 하나이다.

다익스트라 알고리즘이 다이나믹 프로그래밍 문제인 이유는 **최단 거리는 여러 개의 최단 거리로 이루어져있기 때문**이다. 작은 문제가 큰 문제의 부분 집합에 속해있다고 볼 수 있다. 기본적으로 다익스트라는 하나의 최단 거리를 구할 때 그 이전까지 구했던 최단 거리 정보를 그대로 사용한다는 특징이 있다.

> 다익스트라 알고리즘은 *현재까지 알고 있던 최단 경로를 계속해서 갱신* 한다.

> [!note] 구체적인 작동 과정은 다음과 같다.
> 1. 출발 노드를 설정한다.
> 2. 출발 노드를 기준으로 각 노드의 최소 비용을 저장한다.
> 3. 방문하지 않은 노드 중에서 가장 비용이 적은 노드를 선택한다.
> 4. 해당 노드를 거쳐서 특정한 노드로 가는 경우를 고려하여 최소 비용을 갱신한다.
> 5. 3~4번을 반복한다.

```
#include <stdio.h>

int number = 6;
int INF = 10000000;

// 전체 그래프 초기화
int a[6][6] = {
	{0, 2, 5, 1, INF, INF},
	{2, 0, 3, 2, INF, INF},
	{5, 3, 0, 3, 1, 5},
	{1, 2, 3, 0, 1, INF},
	{INF, INF, 1, 1, 0, 2},
	{INF, INF, 5, INF, 2, 0},
};
bool v[6]; // 방문한 노드
int d[6]; // 거리

// 가장 최소 거리를 가지는 정점 반환
int getSmallIndex() {
	int min = INF;
	int index = 0;
	for(int i = 0; i < number; i++) {
		if(d[i] < miin && !v[i]) {
			min = d[i];
			index = i;
		}
	}
	return index;
}

void dijkstra(int start) {
	for(int i = 0; i < number; i++) {
		d[i] = a[start][i];
	}
	v[start] = true;
	for(int i = 0; i < number - 2; i++) {
		int current = getSmallIndex();
		v[current] = true;
		for(int j = 0; j < 6; j++) {
			if(!v[j]) {
				if(d[current] + a[current][j] < d[j]) {
					d[j] = d[current] + a[current][j];
				}
			}
		}
	}
}

int main() {
	dijkstra(0);
	for(int i = 0; i < number; i++) {
		printf("%d ", d[i]);
	}
}
```

위 소스코드는 최소 비용을 단순히 **선형 탐색**으로 찾도록 만들었다. 이 경우 다익스트라의 시간 복잡도가 $O(N^2)$으로 형성된다. 따라서 최대한 빠르게 작동시켜야 하는 경우 힙 구조를 활용하여 시간 복잡도 $O(N*logN)$을 만들 수 있다. 특히 위 소스코드는 **정점의 갯수가 많은데 간선은 적을 때** 치명적일 정도로 비효율적일 수 있다.

```
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int number = 6;
int INF = 10000000;

vector<pair<int, int> > a[7]; // 간선 정보
int d[7]; // 최소 비용

void dijkstra(int start) {
	d[start] = 0;
	priority_queue<pair<int, int> > pq; // 힙 구조
	pq.push(make_pair(start, 0));
	// 가까운 순서대로 처리하므로 큐를 사용
	while(!pq.empty()) {
		int current = pq.top().first;
		// 짧은 것이 먼저 오도록 음수화
		int distance = -pq.top().second;
		pq.pop();
		// 최단 거리가 아닌 경우 스킵
		if(d[current] < distance) continue;
		for(int i = 0; i < a[current].size(); i++) {
			// 선택된 노드의 인접 노드
			int next = a[current][i].first;
			// 선택된 노드를 인접 노드로 거쳐서 가는 비용
			int nextDistance = distance + a[current][i].second;
			// 기존의 최소 비용보다 더 저렴하다면 교체
			if(nextDistance < d[next]) {
				d[next] = nextDistance;
				pq.push(make_pair(next, -nextDistance));
			}
		}
	}
}

int main() {
	// 기본적으로 연결되지 않은 경우 비용은 무한
	for(int i = 1; i <= number; i++) {
		d[i] = INF;
	}
	
	a[1]. push_back(make_pair(2, 2));
	a[1]. push_back(make_pair(3, 5));
	a[1]. push_back(make_pair(4, 1));
	
	a[2]. push_back(make_pair(1, 2));
	a[2]. push_back(make_pair(3, 3));
	a[2]. push_back(make_pair(4, 2));
	
	a[3]. push_back(make_pair(1, 5));
	a[3]. push_back(make_pair(2, 3));
	a[3]. push_back(make_pair(4, 3));
	a[3]. push_back(make_pair(5, 1));
	a[3]. push_back(make_pair(6, 5));
	
	a[4]. push_back(make_pair(1, 1));
	a[4]. push_back(make_pair(2, 2));
	a[4]. push_back(make_pair(3, 3));
	a[4]. push_back(make_pair(5, 1));
	
	a[5]. push_back(make_pair(3, 1));
	a[5]. push_back(make_pair(4, 1));
	a[5]. push_back(make_pair(6, 2));
	
	a[6]. push_back(make_pair(3, 5));
	a[6]. push_back(make_pair(5, 2));
	
	dijkstra(1);
	
	// 결과 출력
	for(int i = 1; i <= number; i++) {
		printf("%d ", d[i]);
	}
}
```

위 소스코드는 **인접 리스트 방식을 활용**하여 시간 복잡도 $O(N*logN)$으로 구현한 것이다. 이 경우 정점에 비해 간선의 갯수가 비정상적으로 적어도 안정적으로 처리할 수 있다.