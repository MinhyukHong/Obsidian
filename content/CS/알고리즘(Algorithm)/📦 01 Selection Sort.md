
선택 정렬은 가장 작은 값을 선택해서 앞으로 보내는 정렬 알고리즘이다.

> 다음의 숫자를 오름차순으로 정렬하는 프로그램을 작성해보자.
> 1 10 5 8 7 6 4 3 2 9


> *가장 작은 것을 선택해서 제일 앞으로 보내면 어떨까?*

```
#include <stdio.h>

int main(void) {
	int i, j, min, index, temp;
	int array[10] = {1, 10, 5, 8, 7, 6, 4, 3, 2, 9};
	for(i = 0; i < 10; i++) {
		min = 9999;
		for(j = i; j < 10; j++) {
			if(min > array[j]) {
				min = array[j];
				index = j;
			}
		}
		temp = array[i];
		array[i] = array[index];
		array[index] = temp;
	}
	for(i = 0; i < 10; i++) {
		printf("%d ", array[i]);
	}	
	return 0;
}
```

이 코드에서 가장 중요한 것은 데이터의 갯수가 N개일 때 총 몇 번의 비교 연산을 해야 되는지이다. 선택 정렬은 대략 N * (N + 1) / 2 번 가량의 연산을 수행해야 한다.
즉, 선택 정렬의 시간 복잡도는 $O(N^2)$ 이다.

따라서 정렬해야 할 데이터의 갯수가 10,000개라면 대략 일 억 번 정도 계산을 한다고 가정하겠다는 의미이다. 실제로 이 정도의 Time Complexity를 가지는 선택 정렬은 효율적이라고 볼 수 없다.