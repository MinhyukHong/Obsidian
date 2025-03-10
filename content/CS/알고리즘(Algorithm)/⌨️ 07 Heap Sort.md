
힙 정렬을 수행하기 위해서는 **힙 생성 알고리즘(Heapify Algorithm)** 을 사용한다. 힙 생성 알고리즘은 '하나의 노드'에 대해서 수행하는 것이다. 그리고 해당 *하나의 노드를 제외하고는 최대 힙이 구성되어 있는 상태* 라고 가정하는 특징이 있다. 아래 이미지가 정확히 해당 가정에 부합한다.
트리에서 5만 최대 힙 정렬을 수행해주면 전체 트리가 최대 힙 구조로 형성되는 상태이다.

![Figure 1](Heap_Sort_1.png)

힙 생성 알고리즘은 특정한 노드의 두 자식 중에서 더 큰 자식과 자신의 위치를 바꾸는 알고리즘이다. 또한 위치를 바꾼 뒤에도 여전히 자식이 존재하는 경우 또 자식 중에서 더 큰 자식과 자신의 위치를 바꾸어야 한다(자식이 존재하지 않을 때까지).

힙 생성 알고리즘의 시간 복잡도는 $O(logN)$ 이다.


> 다음의 데이터를 오름차순 정렬
> 7 6 5 8 3 5 9 1 6

기본적으로 완전 이진 트리를 표현하는 쉬운 법은 배열에 그대로 삽입하는 것이다. 현재 정렬할 데이터의 갯수가 9개이기 때문에 인덱스 0부터 8까지 차례대로 담는다.

![Figure 2](Heap_Sort_2.png)

배열에 있는 인덱스가 차례대로 트리로 표현된 것이다. 이후 배열을 다시 완전 이진 트리로 표현해야 한다. 이 때 데이터의 갯수가 N개 이므로 전체 트리를 힙 구조로 만드는 시간 복잡도는 $O(N*logN)$ 이다. 하지만, 사실상 모든 데이터를 기준으로 힙 생성 알고리즘을 쓰지 않아도 되기 때문에 $O(N)$ 에 가까운 속도를 낼 수 있다.

```
#include <stdio.h>

int number = 9;
int heap[9] = {7, 6, 5, 8, 3, 5, 9, 1, 6};

int main(void) {
	// 힙 구성
	for(int i = 1; i < number; i++) {
		int c = i;
		do {
			int root = (c - 1) / 2;
			if(heap[root] < heap[c]) {
				int temp = heap[root];
				heap[root] = heap[c];
				heap[c] = temp;
			}
			c = root;
		} while(c != 0);
	}
	// 크기를 줄여가며 반복적으로 힙 구성
	for(int i = number - 1; i >= 0; i--) {
		int temp = heap[0];
		heap[0] = heap[i];
		heap[i] = temp;
		int root = 0;
		int c = 1;
		do {
			c = 2 * root + 1;
			// 자식 중에서 더 큰 값 탐색
			if(c < i - 1 && heap[c] < heap[c + 1]) {
				c++;
			}
			// 루트보다 자식이 크다면 교환
			if(c < i && heap[root] < heap[c]) {
				temp = heap[root];
				heap[root] = heap[c];
				heap[c] = temp;
			}
			root = c;
		} while(c < i);
	}
	for(int i = 0; i < number; i++) {
		printf("%d ", heap[i]);
	}
}
```

힙 정렬은 병합 정렬과 다르게 별도로 추가적인 배열이 필요하지 않다는 점에서 메모리 측면에서 효율적이다. 또한 항상 $O(N*logN)$ 을 보장할 수 있다는 점에서 강력하다.