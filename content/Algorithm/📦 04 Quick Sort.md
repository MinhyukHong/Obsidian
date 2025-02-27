

선택 정렬, 버블 정렬, 삽입 정렬 알고리즘은 모두 시간 복잡도 $O(N^2)$ 을 가지는 알고리즘이다. 사실 이러한 복잡도를 가지는 알고리즘은 데이터의 갯수가 10만 개만 넘어가도 일반적인 상황에서 사용하기 매우 어렵다. 그렇기 때문에 더욱 빠른 정렬 알고리즘이 사용될 필요가 있다. 그 대표적인 빠른 알고리즘이 바로 **퀵 정렬** 알고리즘이다. 퀵 정렬은 대표적인 '분할 정복' 알고리즘으로, 평균 속도가 $O(N*logN)$ 이다.


> 다음의 숫자를 오름차순으로 정렬하는 프로그램을 작성해보자.
> 1 10 5 8 7 6 4 3 2 9

퀵 정렬은 하나의 큰 문제를 두 개의 작은 문제로 분할하는 식으로 빠르게 정렬한다. 더 쉽게 말하자면, 특정한 값을 기준으로 큰 숫자와 작은 숫자를 서로 교환한 뒤에 배열을 반으로 나눈다.


> 특정한 값을 기준으로 큰 숫자와 작은 숫자를 나누면 어떨까?

일반적으로 퀵 정렬에서는 *기준 값* 이 있다. 이를 **피벗(Pivot)** 이라고도 하는데, 보통 첫 번째 원소를 피벗 값으로 설정하고 사용한다. 다음과 같이 1이라는 값이 먼저 피벗 값으로 설정이 되었다고 생각해보자.

(1) 10 5 8 7 6 4 3 2 9 

이 경우 1보다 큰 숫자를 왼쪽부터 찾고, 1보다 작은 숫자를 오른쪽부터 찾는다. 이 때 1보다 큰 숫자로는 바로 10을 찾을 수 있고, 1보다 작은 숫자는 찾지 못해서 결국 1까지 도달한다. 이 때 작은 값의 인덱스가 큰 값의 인덱스보다 작으므로 피벗 값과 작은 값의 위치를 바꾼다. 즉, 1과 1을 교환하므로 변경 사항은 없다.

```
#include <stdio.h>

int number = 10;
int data[10] = {1, 10, 5, 8, 7, 6, 4, 3, 2, 9};

void quickSort(int *data, int start, int end) {
	if(start >= end) { // 원소가 1개인 경우
		return;
	}
	
	int key = start; // 키는 첫번째 원소
	int i = start + 1; // 왼쪽 출발 지점
	int j = end; // 오른쪽 출발 지점
	int temp;

	while(i <= j) { // 엇갈릴 때까지 반복
		while(data[i] <= data[key]) { // 키 값보다 큰 값을 만날 때까지 오른쪽으로 이동
			i++;
		}
		while(data[j] >= data[key] && j > start) { // 키 값보다 작은 값을 만날 때까지 반복
			j--;
		}
		if(i > j) { // 현재 엇갈린 상태면 키 값과 교체
			temp = data[j];
			data[j] = data[key];
			data[key] = temp;
		}
		else {
			temp = data[j];
			data[j] = data[i];
			data[i] = temp;
		}
	}

	quickSort(data, start, j - 1);
	quickSort(data, j + 1, end);
}

int main(void) {
	quickSort(data, 0, numbe - 1);
	for(int i = 0; i < number; i++) {
		printf("%d ", data[i]);
	}
}
```

위 소스코드에서는 '키 값보다 작은 값을 만날 때까지' 반복하는 부분에서 j가 start보다 클 때에 한해서만 반복문이 수행되도록 처리되어 있다. 이는 항상 왼쪽에 있는 값과 피벗 값을 교환하기 때문이다. 오른쪽에 있는 값은 피벗 값과 교환되지 않으므로 처리해 줄 필요가 없다. 퀵 정렬 알고리즘은 기본적으로 N번씩 탐색하되 반으로 쪼개 들어간다는 점에서 $logN$ 을 곱한 복잡도를 가진다.

> 퀵 정렬의 평균 시간 복잡도는 $O(N*logN)$ 이다.

하지만 퀵 정렬은 피벗 값을 설정하는 것에 따라서 최악의 경우에 ==최악 시간 복잡도==는  $O(N^2)$ 까지 나올 수 있다.


> 다음의 숫자들을 오름차순으로 정렬하는 프로그램을 작성해보자.
> 1 2 3 4 5 6 7 8 9 10

위와 같이 이미 정렬되어 있는 경우, 퀵 정렬의 시간 복잡도는 $O(N^2)$에 가깝다. 반면에 삽입 정렬의 경우 위 문제를 빠르게 풀어낸다. 즉 정렬할 데이터의 특성에 따라서 적절한 정렬 알고리즘을 사용하는 것이 중요하다.


다음의 소스코드는 위의 퀵 정렬 소스코드에서, 내림차순 정렬로만 바꾼 예시이다.

```
#include <stdio.h>

int number = 10;
int data[10] = {1, 10, 5, 8, 7, 6, 4, 3, 2, 9};

void quickSort(int *data, int start, int end) {
	if(start >= end) { // 원소가 1개인 경우
		return;
	}
	
	int key = start; // 키는 첫번째 원소
	int i = start + 1; // 왼쪽 출발 지점
	int j = end; // 오른쪽 출발 지점
	int temp;

	while(i <= j) { // 엇갈릴 때까지 반복
		while(data[i] >= data[key]) { // 키 값보다 큰 값을 만날 때까지 오른쪽으로 이동
			i++;
		}
		while(data[j] <= data[key] && j > start) { // 키 값보다 작은 값을 만날 때까지 반복
			j--;
		}
		if(i > j) { // 현재 엇갈린 상태면 키 값과 교체
			temp = data[j];
			data[j] = data[key];
			data[key] = temp;
		}
		else {
			temp = data[j];
			data[j] = data[i];
			data[i] = temp;
		}
	}

	quickSort(data, start, j - 1);
	quickSort(data, j + 1, end);
}

int main(void) {
	quickSort(data, 0, numbe - 1);
	for(int i = 0; i < number; i++) {
		printf("%d ", data[i]);
	}
}
```