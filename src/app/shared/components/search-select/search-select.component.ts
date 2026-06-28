import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

export interface SearchSelectOption {
  id: string | number | null;
  name: string;
}

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss']
})
export class SearchSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() placeholder = 'Search...';
  @Input() options: SearchSelectOption[] | null | undefined = [];
  @Input() control!: FormControl;
  @Input() clearable = true;
  @Output() valueSelected = new EventEmitter<SearchSelectOption | null>();

  public searchControl: FormControl = new FormControl('');
  public filteredOptions: SearchSelectOption[] = [];
  public isOpen = false;
  private destroyed = new Subject<void>();

  ngOnInit(): void {
    const options = this.getOptions();
    this.filteredOptions = options.slice();

    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroyed),
    ).subscribe(value => {
      const text = typeof value === 'string' ? value : value?.name ?? '';
      const filterValue = text.toLowerCase();
      this.filteredOptions = filterValue
        ? this.getOptions().filter(option => option.name.toLowerCase().includes(filterValue))
        : this.getOptions().slice();
      if (text) {
        const matched = this.getOptions().find(option => option.name === text);
        if (matched) {
          this.control.setValue(matched.id, {emitEvent: true});
          this.valueSelected.emit(matched);
          return;
        }
        if (this.control.value !== null && this.control.value !== '') {
          this.control.setValue(null, {emitEvent: true});
        }
        return;
      }
      if (this.control.value !== null && this.control.value !== '') {
        this.control.setValue(null, {emitEvent: true});
      }
    });

    this.control.valueChanges.pipe(
      takeUntil(this.destroyed),
    ).subscribe(value => {
      const matched = this.getOptions().find(option => String(option.id) === String(value));
      if (matched && this.searchControl.value !== matched.name) {
        this.searchControl.setValue(matched.name, {emitEvent: false});
      }
      if (!matched && !value && this.searchControl.value) {
        this.searchControl.setValue('', {emitEvent: false});
        this.filteredOptions = this.getOptions().slice();
      }
    });

    this.syncFromControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = this.getOptions().slice();
      this.syncFromControl();
    }
  }

  public selectOption(option: SearchSelectOption): void {
    this.control.setValue(option.id);
    this.searchControl.setValue(option.name, {emitEvent: false});
    this.filteredOptions = this.getOptions().slice();
    this.isOpen = false;
    this.valueSelected.emit(option);
  }

  public clearSelection(event?: MouseEvent): void {
    event?.stopPropagation();
    this.control.setValue(null);
    this.searchControl.setValue('', {emitEvent: false});
    this.filteredOptions = this.getOptions().slice();
    this.valueSelected.emit(null);
  }

  public openDropdown(): void {
    this.isOpen = true;
  }

  public closeDropdown(): void {
    window.setTimeout(() => {
      this.isOpen = false;
    }, 150);
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private syncFromControl(): void {
    const matched = this.getOptions().find(option => String(option.id) === String(this.control?.value));
    if (matched) {
      this.searchControl.setValue(matched.name, {emitEvent: false});
    }
  }

  private getOptions(): SearchSelectOption[] {
    return this.options ?? [];
  }
}
