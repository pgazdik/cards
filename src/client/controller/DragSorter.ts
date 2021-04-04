export class DragSorter {

    static makeReSortable(container: HTMLElement) {
        var dragEl: HTMLElement;
        var lastTarget: HTMLElement; // last element we have hovered over
        var lastNext: boolean;

        var nextTarget: HTMLElement;
        var nextNext: boolean;

        Array.from(container.children).forEach(item => (item as HTMLElement).draggable = true);

        container.addEventListener('dragstart', onDragStart);

        function onDragStart(e: DragEvent): void {
            if (!e.ctrlKey) {
                e.preventDefault();
                return;
            }

            dragEl = <HTMLElement>e.target;
            lastTarget = dragEl;

            if (e.dataTransfer)
                e.dataTransfer.effectAllowed = 'move';

            container.addEventListener('dragover', onDragOver, false);
            container.addEventListener('dragend', onDragEnd, false);
        }

        function onDragOver(e: DragEvent): void {
            e.preventDefault();
            if (e.dataTransfer)
                e.dataTransfer.dropEffect = 'move';

            if (handleDragOver(e))
                removeShifts();

            lastTarget = nextTarget;
            lastNext = nextNext;
        }

        /* returns true iff shifts should be dropped (for various reasons) */
        function handleDragOver(e: DragEvent): boolean {
            var target = findEnclosingDraggableElement(<HTMLElement>e.target);
            if (!target)
                return false;

            nextTarget = target;
            nextNext = wouldInsertAfter(nextTarget, e);

            if (isSamePositionAsLastTime())
                return false;

            if (wouldInsertOnOriginalPosition())
                return true;

            removeShifts();
            applyShifts();

            return false;
        }

        function findEnclosingDraggableElement(e: HTMLElement): HTMLElement | null {
            while (true) {
                if (e?.draggable)
                    return e;
                e = <HTMLElement>e.parentNode;
                if (!e)
                    return null;
            }
        }

        function wouldInsertAfter(target: HTMLElement, e: DragEvent): boolean {
            var targetPos = target.getBoundingClientRect();
            return (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > 0.5;
        }

        function wouldInsertOnOriginalPosition(): boolean {
            return nextTarget === dragEl ||
                (nextNext && nextDraggableElement(nextTarget) == dragEl) ||
                (!nextNext && nextDraggableElement(dragEl) == nextTarget)
        }

        function isSamePositionAsLastTime(): boolean {
            if (nextTarget === lastTarget && nextNext === lastNext)
                return true;

            return lastTarget != null && (
                (lastNext && nextDraggableElement(lastTarget) === nextTarget && !nextNext) ||
                (nextNext && nextDraggableElement(nextTarget) === lastTarget && !lastNext)
            )
        }

        function applyShifts() {
            nextTarget.classList.add("shifted");
            if (nextNext) {
                nextTarget.style.left = "-25px";

                var nextElement = nextDraggableElement(nextTarget);
                if (nextElement) {
                    nextElement.classList.add("shifted");
                    nextElement.style.left = "25px";
                }
            } else {
                nextTarget.style.left = "25px";
                var prevElement = <HTMLElement>Array.from(container.children).find(e => { return nextDraggableElement(<HTMLElement>e) === nextTarget });
                if (prevElement) {
                    prevElement.classList.add("shifted");
                    prevElement.style.left = "-25px";
                }
            }

        }

        function onDragEnd(e: DragEvent): void {
            e.preventDefault();
            removeShifts();


            logInsertBefore();

            container.removeEventListener('dragover', onDragOver, false);
            container.removeEventListener('dragend', onDragEnd, false);
        }

        function logInsertBefore(): void {
            if (wouldInsertOnOriginalPosition())
                return;

            const newNext = lastNext ? nextDraggableElement(lastTarget) : lastTarget;
            console.log("Insert before: " + newNext);
        }

        function removeShifts(): void {
            document.querySelectorAll(".shifted").forEach(e => {
                var he = <HTMLElement>e;
                e.classList.remove("shifted");
                he.style.left = "";
            })
        }

        function nextDraggableElement(cardBox: HTMLElement): HTMLElement | null {
            while (true) {
                cardBox = <HTMLElement>cardBox.nextSibling;
                if (!cardBox)
                    return null;
                if (cardBox.draggable)
                    return cardBox
            }
        }

    }

}

