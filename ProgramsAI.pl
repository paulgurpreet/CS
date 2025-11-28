/************************************************************
 1. Write a PROLOG program to implement the family tree
    and demonstrate the family relationship.
************************************************************/

male(ram).
male(raj).
male(aman).
female(sita).
female(geeta).
female(meera).

parent(raj, ram).
parent(sita, ram).
parent(raj, geeta).
parent(sita, geeta).
parent(ram, aman).
parent(meera, aman).

father(F, C) :- male(F), parent(F, C).
mother(M, C) :- female(M), parent(M, C).
sibling(X, Y) :- parent(P, X), parent(P, Y), X \= Y.
grandparent(GP, GC) :- parent(GP, P), parent(P, GC).

/* Example
?- father(raj, ram).
true.
*/


/************************************************************
 2. Write a PROLOG program to implement
    conc(L1, L2, L3) where L2 is appended to L1 to get L3.
************************************************************/

conc([], L, L).
conc([H|T], L, [H|R]) :- conc(T, L, R).

/* Example
?- conc([1,2,3], [4,5], L3).
L3 = [1,2,3,4,5].
*/


/************************************************************
 3. Write a PROLOG program to implement
    reverse(L, R) where R is reversed list of L.
************************************************************/

reverse_list(L, R) :- rev_acc(L, [], R).
rev_acc([], A, A).
rev_acc([H|T], A, R) :- rev_acc(T, [H|A], R).

/* Example
?- reverse_list([1,2,3,4], R).
R = [4,3,2,1].
*/


/************************************************************
 4. Write a PROLOG program to calculate
    the sum of two numbers.
************************************************************/

sum_two(X, Y, S) :- S is X + Y.

/* Example
?- sum_two(10, 20, S).
S = 30.
*/


/************************************************************
 5. Write a PROLOG program to implement
    max(X, Y, M) so that M is maximum of X and Y.
************************************************************/

max(X, Y, X) :- X >= Y.
max(X, Y, Y) :- Y > X.

/* Example
?- max(12, 9, M).
M = 12.
*/


/************************************************************
 6. Write a program in PROLOG to implement
    factorial(N, F) where F represents factorial of N.
************************************************************/

factorial(0, 1).
factorial(N, F) :-
    N > 0,
    N1 is N - 1,
    factorial(N1, F1),
    F is N * F1.

/* Example
?- factorial(5, F).
F = 120.
*/


/************************************************************
 7. Write a program in PROLOG to implement
    generate_fib(N, T) where T is Nth Fibonacci term.
************************************************************/

generate_fib(0, 0).
generate_fib(1, 1).
generate_fib(N, T) :-
    N > 1,
    N1 is N - 1,
    N2 is N - 2,
    generate_fib(N1, T1),
    generate_fib(N2, T2),
    T is T1 + T2.

/* Example
?- generate_fib(7, T).
T = 13.
*/


/************************************************************
 8. Write a PROLOG program to implement
    power(Num, Pow, Ans) where Num^Pow = Ans.
************************************************************/

power(_, 0, 1).
power(N, P, A) :-
    P > 0,
    P1 is P - 1,
    power(N, P1, A1),
    A is N * A1.

/* Example
?- power(2, 5, A).
A = 32.
*/


/************************************************************
 9. PROLOG program to implement
    multi(N1, N2, R) where R = N1 * N2.
************************************************************/

multi(X, Y, R) :- R is X * Y.

/* Example
?- multi(6, 7, R).
R = 42.
*/


/************************************************************
10. Write a PROLOG program to implement
    memb(X, L) to check whether X is a member of L or not.
************************************************************/

memb(X, [X|_]).
memb(X, [_|T]) :- memb(X, T).

/* Example
?- memb(3, [1,2,3,4]).
true.
*/


/************************************************************
11. Write a PROLOG program to implement
    sumlist(L, S) so that S is the sum of list L.
************************************************************/

sumlist([], 0).
sumlist([H|T], S) :-
    sumlist(T, S1),
    S is H + S1.

/* Example
?- sumlist([5,5,5,5], S).
S = 20.
*/


/************************************************************
12. Write a PROLOG program to implement predicates
    evenlength(List) and oddlength(List).
************************************************************/

evenlength([]).
evenlength([_|T]) :- oddlength(T).

oddlength([_]).
oddlength([_|T]) :- evenlength(T).

/* Example
?- evenlength([1,2,3,4]).
true.
*/


/************************************************************
13. Write a PROLOG program to implement
    maxlist(L, M) so that M is maximum number in list L.
************************************************************/

maxlist([X], X).
maxlist([H|T], M) :-
    maxlist(T, M1),
    (H >= M1 -> M = H ; M = M1).

/* Example
?- maxlist([10, 50, 25, 70, 5], M).
M = 70.
*/


/************************************************************
14. Write a PROLOG program to implement
    insert(I, N, L, R) that inserts I at Nth position in L.
************************************************************/

insert(I, 1, L, [I|L]).
insert(I, N, [H|T], [H|R]) :-
    N > 1,
    N1 is N - 1,
    insert(I, N1, T, R).

/* Example
?- insert(99, 3, [10,20,30,40], R).
R = [10,20,99,30,40].
*/


/************************************************************
15. Write a PROLOG program to implement
    delete(N, L, R) that removes Nth element from L.
************************************************************/

delete_nth(1, [_|T], T).
delete_nth(N, [H|T], [H|R]) :-
    N > 1,
    N1 is N - 1,
    delete_nth(N1, T, R).

/* Example
?- delete_nth(4, [10,20,30,40,50], R).
R = [10,20,30,50].
*/

